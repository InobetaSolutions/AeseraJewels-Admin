import { useEffect, useState } from "react";
import { API_URL } from "../../../../service";

const FetchFAQ = () => {
    const [faq, setFaq] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(API_URL + "getallFAQ")
            .then(response => response.json())
            .then(data => {
                if (data.resposne && data.resposne.length > 0) {
                    setFaq(data.resposne[0]);
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
            <h2>{faq.question}</h2>
            <p>{faq.answer}</p>
            <small>Last updated: {new Date(faq.updatedAt).toLocaleString()}</small>
        </div>
    );
};

export default FetchFAQ;
