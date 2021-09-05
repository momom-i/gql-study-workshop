import { useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import {
    ProductDetailQuery,
    ProductDetailQueryVariables
} from "./__generated__/product-detail-query";

const query = gql`
    query ProductDetailQuery($id: ID!) {
        product(id: $id) {
            id
            name
            description
            reviews {
                id
                commentBody
            }
        }
    }
`;

export default function ProductDetail() {
    const { productId } = useParams<{ readonly productId: string}>();
    const { data, loading } = useQuery<
        ProductDetailQuery,
        ProductDetailQueryVariables
    >(query, {
        variables: {
            id: productId
        }
    });
    if (loading) return <div>loading...</div>;
    if (!data?.product) return <div>not found</div>;
    const { product } = data;
    return (
        <>
            <h1>{product.name}</h1>
            <p style={{ whiteSpace: "pre-wrap"}}>
                {product.description}
            </p>
            <div>
                <h2>レビュー</h2>
                {product.reviews.length ? (
                    <ul>
                        {product.reviews.map( (r: { id: string; commentBody: string}) => (
                            <li key={r.id}>{r.commentBody}</li>
                        ))}
                    </ul>
                ) : (
                    <p>レビューはまだありません</p>
                )}
            </div>
        </>
    );
}
