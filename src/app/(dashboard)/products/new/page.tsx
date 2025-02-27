import React from 'react';
import ProductForm from '../_components/product-form';
import { Separator } from "@/components/ui/separator";

const AddNewProductPage = () => {
    return (
        <section className='p-6'>
            <div>
            <p className="text-heading2-bold text-gray-1">Create Collection</p>
            <Separator className="mt-4 mb-7 bg-gray-1" />
            </div>
         <ProductForm/>   
        </section>
    );
};

export default AddNewProductPage;