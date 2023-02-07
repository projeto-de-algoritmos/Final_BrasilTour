from pydantic import BaseModel as BaseSchema

class Path(BaseSchema):
    source: str
    destination: str

class Profit(BaseSchema):
    max_weight: int
    weights: list
    values: list
 