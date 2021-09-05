import { useParams } from "react-router-dom";
import { useQuery, gql, useMutation } from "@apollo/client";
import {
    ProductDetailQuery,
    ProductDetailQueryVariables
} from "./__generated__/product-detail-query";
import {
    AddReviewMutation,
    AddReviewMutationVariables
} from "./__generated__/add-review-mutation";
import { useState } from "react";

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

const mutation = gql`
    mutation AddReviewMutation($pid: ID!, $comment: String!) {
        addReview(
            productId: $pid
            addReviewInput: { commentBody: $comment, star: 0 }
        ) {
            id
        }
    }
`;

export default function ProductDetail() {
    const [myComment, setMyComment] = useState("");
    const { productId } = useParams<{ readonly productId: string}>();
    const { data, loading, refetch } = useQuery<
        ProductDetailQuery,
        ProductDetailQueryVariables
    >(query, {
        variables: {
            id: productId
        }
    });
    const [addReview, { loading: submitting }] = useMutation<AddReviewMutation, AddReviewMutationVariables
    >(mutation, {
        // after executing Mutation
        update(_, { data }) {
            if (!data?.addReview) return;
            setMyComment("");
            refetch();
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
            <form
                onSubmit={ e => {
                    e.preventDefault();
                    addReview({
                        variables: {
                            pid: productId,
                            comment: myComment
                        }
                    });
                    }
                }>
                    <div>
                        <label>
                            コメント
                            <textarea
                            value={myComment}
                            onChange={e => setMyComment(e.target.value)} 
                            />
                        </label>
                    </div>
                    <button type="submit" disabled={submitting}>
                        追加
                    </button>
            </form>
        </>
    );
}
