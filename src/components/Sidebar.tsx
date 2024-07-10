// @ts-ignore
import React, { useState} from 'react'
import {
    Box, Button,
    Stack, Switch, Typography
} from "@mui/material";
import InputField from "./InputField";
import CustomSwitcher from "./CustomSwitcher";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
interface SidebarProps {
    data: {
        locations: string[];
        products: string[];
        categories: string[];
    };
}

const Sidebar: React.FC<SidebarProps> = ({ data }) => {
    const { locationsData, productsData, categoriesData } = data;

    const [selectedItems, setSelectedItems] = React.useState({
        locations: [] as string[],
        products: [] as string[],
        categories: [] as string[],
        has_cashback: false
    });

    const [formData, setFormData] = React.useState({
        locations: [] as string[],
        products: [] as string[],
        categories: [] as string[],
        has_cashback: false
    });

    const handleSelectChange = (type: 'locations' | 'products' | 'categories') => (
        event: React.ChangeEvent<{ value: unknown }>
    ) => {
        const { value } = event.target;
        setSelectedItems((prevSelectedItems) => ({
            ...prevSelectedItems,
            [type]: value as string[],
        }));
    };

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;
        setSelectedItems((prevSelectedItems) => ({
            ...prevSelectedItems,
            has_cashback: checked,
        }));
    };

    const handleSubmit =  () => {
setFormData(selectedItems)
    };

    return (

        <>
        <Box sx={{ backgroundColor: 'white', width: '20%', color: 'black' }} padding={'1rem'}>
         <InputField items={locationsData} selectedItems={selectedItems.locations} onChange={handleSelectChange('locations')} label={'Locations'}  />
            <InputField items={productsData} selectedItems={selectedItems.products} onChange={handleSelectChange('products')} label={'Products'}   />
            <InputField items={categoriesData} selectedItems={selectedItems.categories} onChange={handleSelectChange('categories')} label={'Categories'}   />

            <Box display={'flex'} alignItems={'center'} gap={2} padding={'1rem'}>
                <Typography>Has Cashback officers?</Typography>
                <CustomSwitcher selectedItems={selectedItems.has_cashback} onChange={handleSwitchChange}/>
            </Box>

            <Box display="flex" justifyContent="center" padding={'1rem'}>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#F59100',
                        borderRadius: '100px',
                        width: '100%',
                        '&:hover': { backgroundColor: '#ee8e03' },
                    }}
                    onClick={handleSubmit}
                >
                    Search
                </Button>
            </Box>

        </Box>
        </>

    );
};

export default Sidebar;