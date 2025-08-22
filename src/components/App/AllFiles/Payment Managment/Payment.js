import { useEffect, useState } from "react";
import { API_URL } from "../../../../service";

const FetchTermsAndConditions = () => {
    const [terms, setTerms] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(API_URL + "getTermsAndConditions")
            .then(response => response.json())
            .then(data => {
                if (data.response && data.response.length > 0) {
                    setTerms(data.response[0]);
                }
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>{terms.title}</h2>
            {terms.body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
            <small>Last updated: {new Date(terms.updatedAt).toLocaleString()}</small>
        </div>
    );
};

export default FetchTermsAndConditions;
