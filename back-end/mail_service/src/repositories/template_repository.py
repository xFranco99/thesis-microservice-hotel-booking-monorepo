from datetime import datetime
from typing import Optional

from sqlalchemy.orm import Session

from exceptions.template_exception import TemplateAlreadyExistException
from models.mail_model import Template
from schemas.mail_schema import TemplateInput, TemplateComplete

def obj_to_dict_non_none(data):
    return {
        key: value for key, value in data.__dict__.items()
        if value not in (None, '') and key != '_sa_instance_state'
    }

class TemplateRepository:
    def __init__(self, session: Session):
        self.session = session

    def template_exist(self, name: str) -> bool:
        _template = self.find_by_template_name(name)
        return _template and _template.delete == False

    def template_not_exist(self, name: str) -> bool:
        return not self.template_exist(name)

    def create_template(self, template_input: TemplateInput):
        if self.template_exist(template_input.template_name):
            raise TemplateAlreadyExistException(template_input.template_name)

        template_html = template_input.template.encode('utf-8')
        template = Template(**template_input.model_dump(exclude_none=True))

        template.template = template_html
        template.insert_date = datetime.now()
        template.update_date = template.insert_date
        template.delete = False

        self.session.add(template)
        self.session.commit()
        self.session.refresh(template)

    def find_by_template_name(self, name: str) -> Optional[TemplateComplete]:
        template = self.session.query(Template).filter_by(template_name=name).first()
        return TemplateComplete(**template.__dict__) if template else None

    def delete_template_by_id(self, template_id):
        self.session.query(Template).filter_by(id=template_id).delete()
        self.session.commit()

    def get_all_template(self):
        return self.session.query(Template).all()

    def update_template_by_id(self, template_id: int, data: Template):

        obj_full = obj_to_dict_non_none(data)

        self.session.query(Template).filter_by(id=template_id).update(obj_full)
        self.session.commit()