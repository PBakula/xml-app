import React, { useState } from "react";
import { Form, Button, Alert, Accordion, Card } from "react-bootstrap";
import { filterByXPath } from "../../services/studentService";

const XPATH_EXAMPLES = [
  {
    name: "All Students",
    expression: "//student",
    description: "Finds all student elements",
  },
  {
    name: "High GPA Students",
    expression: "//student[gpa > 4.0]",
    description: "Finds students with a GPA higher than 4.0",
  },
  {
    name: "High-Stress Students",
    expression: "//student[stressLevel='high']",
    description: "Finds students with a high level of stress",
  },
  {
    name: "Low Sleep, Good GPA",
    expression: "//student[sleepHoursPerDay < 6 and gpa > 3.5]",
    description: "Students who sleep little but have a good GPA",
  },
  {
    name: "Social Students",
    expression: "//student[socialHoursPerDay > 3]",
    description:
      "Students who spend more than 3 hours per day on social activities",
  },
];

export const XPathSearch = () => {
  const [xpathExpression, setXpathExpression] = useState("");
  const [searchResults, setSearchResults] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!xpathExpression.trim()) {
      setError("Unesite XPath izraz za pretraživanje");
      return;
    }

    setLoading(true);
    setError("");
    setSearchResults("");

    try {
      const result = await filterByXPath(xpathExpression);
      setSearchResults(result);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const applyXPathExample = (expression) => {
    setXpathExpression(expression);
  };

  return (
    <section className="mb-4">
      <h2 className="h4 mb-3">XPath Student search</h2>

      <Form onSubmit={handleSearch} className="mb-3">
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            value={xpathExpression}
            onChange={(e) => setXpathExpression(e.target.value)}
            placeholder="Enter xpath here"
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Filtering..." : "Filter with XPath"}
        </Button>
      </Form>

      <Accordion className="mb-3">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Xpath examples</Accordion.Header>
          <Accordion.Body>
            <div className="row">
              {XPATH_EXAMPLES.slice(0, 4).map((example, index) => (
                <div key={index} className="col-lg-3 col-md-6 col-sm-12 mb-3">
                  <Card className="h-100">
                    <Card.Header>{example.name}</Card.Header>
                    <Card.Body>
                      <Card.Text>{example.description}</Card.Text>
                      <code className="d-block mb-2">{example.expression}</code>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => applyXPathExample(example.expression)}
                      >
                        Apply
                      </Button>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {searchResults && (
        <div className="mb-3">
          <h3 className="h5 mb-2">Filtered XML</h3>
          <Form.Control
            as="textarea"
            value={searchResults}
            readOnly
            style={{ height: "300px", fontFamily: "monospace" }}
          />
        </div>
      )}
    </section>
  );
};

export default XPathSearch;
