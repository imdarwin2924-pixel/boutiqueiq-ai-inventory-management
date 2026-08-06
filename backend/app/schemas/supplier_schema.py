from pydantic import BaseModel


class SupplierCreate(BaseModel):
    supplier_name: str
    contact_person: str
    phone: str
    email: str
    address: str


class SupplierUpdate(BaseModel):
    supplier_name: str
    contact_person: str
    phone: str
    email: str
    address: str


class SupplierResponse(BaseModel):
    supplier_id: int
    supplier_name: str
    contact_person: str
    phone: str
    email: str
    address: str

    class Config:
        from_attributes = True