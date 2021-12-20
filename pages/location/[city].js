import React from 'react';

export async function getServerSideProps(context) {
    const cityID = getCity(context.params.city);
    const slug = context.params.city;

    return {
        props: {
            slug: slug,
        },
    };
}

const getCity = param => {
    const cityParam = param.trim();
    // get the id of the city by splitting the API
    const splitCity = cityParam.split('-');
    const id = splitCity[splitCity.length - 1];
}

export default function City({slug}) {
    return (
        <div>
            <h1>City Page</h1>
            <h2>{slug}</h2>
        </div>
    );
}