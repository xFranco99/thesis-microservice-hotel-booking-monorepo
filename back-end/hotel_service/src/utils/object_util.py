def obj_to_dict_non_none(data):
    return {
        key: value for key, value in data.__dict__.items()
        if value not in (None, '') and key != '_sa_instance_state'
    }