type CustomerMetadata = {
    username: string;
};

export interface Customer {
    id: string;
    created_at: string;
    email: string;
    given_name: string;
    family_name: string;
    company_name: string;
    address_line1: string;
    address_line2: string;
    address_line3: string;
    city: string;
    region: string;
    postal_code: string;
    country_code: string;
    language: string;
    swedish_identity_number: number;
    danish_identity_number: number;
    phone_number: number;
    metadata: CustomerMetadata;
}

export type CustomerBankAccount = {
    account_number: string;
    branch_code: string;
    account_holder_name: string;
    country_code: string;
    links: {
        customer: string;
    };
};

export interface CreateBankAccountInput
    extends Omit<CustomerBankAccount, "links"> {
    customeId: string;
}

export type CreateCustomerInput = Omit<Customer, "id">;
