/* eslint-disable */
/* This is an autogenerated file. Do not edit this file directly! */
export type ProductReviewFragment = {
    reviews: ({
        id: string;
        commentBody: string;
    })[];
};
export type ProductDetailQuery = {
    product: ({
        id: string;
        name: string;
        description: string;
    } & ProductReviewFragment) | null;
};
export type ProductDetailQueryVariables = {
    id: string;
};
