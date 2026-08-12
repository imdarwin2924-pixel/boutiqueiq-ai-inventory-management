from pydantic import BaseModel


class CustomerCreate(BaseModel):
    customer_name: str
    phone: str
    email: str
    address: str


class CustomerUpdate(BaseModel):
    customer_name: str
    phone: str
    email: str
    address: str


class CustomerResponse(BaseModel):
    customer_id: int
    customer_name: str
    phone: str
    email: str
    address: str

    class Config:
        from_attributes = True