
const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Hello World!"));
app.use(express.json());
const properties = [
  { id: 1, name: "Riverwalk", address: "2828 Northwest 1st Avenue, Miami, FL 33127", phone: "+1234567890", category: "Apartment Complex", website: "Available" },
  { id: 2, name: "Sunset Villas", address: "123 Sunset Blvd, Los Angeles, CA 90028", phone: "+1987654321", category: "Apartment Complex", website: "Available" },
  { id: 3, name: "Ocean Breeze", address: "456 Ocean Drive, Miami Beach, FL 33139", phone: "+1098765432", category: "Condo", website: "Unavailable" },
  { id: 4, name: "City Lights", address: "789 Main St, New York, NY 10001", phone: "+1230987654", category: "Apartment Complex", website: "Available" },
  { id: 5, name: "Maple Leaf", address: "101 Maple Ave, Toronto, ON M5H 2N2", phone: "", category: "Apartment Complex", website: "Unavailable" },
  { id: 6, name: "Lakeside Retreat", address: "", phone: "+13121234567", category: "Apartment Complex", website: "Available" },
  { id: 7, name: "Urban Oasis", address: "303 City Park Ave, Denver, CO 80205", phone: "+17201234567", category: "Apartment Complex", website: "Available" },
  { id: 8, name: "Mountain View", address: "404 Mountain Rd, Aspen, CO 81611", phone: "+19701234567", category: "Condo", website: "Unavailable" },
  { id: 9, name: "Riverside Plaza", address: "505 River St, Boston, MA 02108", phone: "+16171234567", category: "Apartment Complex", website: "Available" },
  { id: 10, name: "Sunny Meadows", address: "606 Meadow Ln, Austin, TX 78701", phone: "+15121234567", category: "Apartment Complex", website: "Unavailable" },
  { id: 11, name: "Pine Woods", address: "707 Pine St, Portland, OR 97205", phone: "", category: "", website: "Available" },
  { id: 12, name: "Green Acres", address: "808 Greenway Dr, Seattle, WA 98101", phone: "+12061234567", category: "Apartment Complex", website: "Available" },
  { id: 13, name: "Hillside Estates", address: "909 Hill Rd, San Francisco, CA 94110", phone: "+14151234567", category: "Condo", website: "Unavailable" },
  { id: 14, name: "The Palms", address: "1010 Palm Ave, Miami, FL 33129", phone: "+13051234567", category: "Apartment Complex", website: "Available" },
  { id: 15, name: "Seaside Towers", address: "1111 Ocean Blvd, Santa Monica, CA 90401", phone: "+13101234567", category: "Apartment Complex", website: "Unavailable" },
  { id: 16, name: "Riverwalk", address: "1212 Riverwalk St, San Antonio, TX 78205", phone: "", category: "Apartment Complex", website: "" }
];


app.get('/api/properties', (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.query;

    const filteredProperties = properties.filter(property =>
        property.name.toLowerCase().includes(search.toLowerCase())
    );
        
    const total = filteredProperties.length;
    const totalPages = Math.ceil(total / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex);
    

    res.json({
        total,
        totalPages,
        currentPage: parseInt(page),
        properties: paginatedProperties
    });
});

app.get('/api/properties/search', (req, res) => {
    const { query } = req.query;
console.log(query);

    const filteredProperties = properties.filter(property =>
        property.name.toLowerCase().includes(query.toLowerCase())
    );

    res.json(filteredProperties);
});
app.post('/api/properties', (req, res) => {
    const { name, address, phone, category, website } = req.body;
    const newProperty = {
        id: properties.length + 1,
        name,
        address,
        phone,
        category,
        website
    };

    properties.push(newProperty);

    res.json(newProperty);
});
app.put('/api/properties/:id', (req, res) => {
    const { id } = req.params;
    const { name, address, phone, category, website } = req.body;
    const existingProperty = properties.find(property => property.id === parseInt(id));

    if (!existingProperty) {
        return res.status(404).json({ message: 'Property not found' });
    }

    existingProperty.name = name.length ? name : existingProperty.name;
    existingProperty.address = address ? address : existingProperty.address;
    existingProperty.phone = phone ? phone : existingProperty.phone;
    existingProperty.category = category ? category : existingProperty.category;
    existingProperty.website = website ? website : existingProperty.website;

    res.json(existingProperty);
});



app.get('/api/properties/issues', (req, res) => {
    const issues = properties.map(property => {
        const issuesList = [];
        if (!property.name) {
            issuesList.push({ property_id: property.id, type: 'No Name', count: 1 });
        }
        if (!property.address) {
            issuesList.push({ property_id: property.id, type: 'No Address', count: 1 });
        }
        if (!property.phone) {
            issuesList.push({ property_id: property.id, type: 'No Phone', count: 1 });
        }
        if (!property.category) {
            issuesList.push({ property_id: property.id, type: 'No Category', count: 1 });
        }
        if (!property.website) {
            issuesList.push({ property_id: property.id, type: 'No Website', count: 1 });
        }

        return issuesList;
    }).flat().reduce((acc, curr) => {
        const existingIssue = acc.find(issue => issue.property_id === curr.property_id && issue.type === curr.type);
        if (existingIssue) {
            existingIssue.count++;
        } else {
            acc.push(curr);
        }

        return acc;
    }, []);

    res.json(issues);
});


app.get('/api/dashboard/summary', (req, res) => {
    const totalProperties = properties.length;
    const availableProperties = properties.filter(property => property.website.toLowerCase() === 'available').length;
    const unavailableProperties = totalProperties - availableProperties;
    const Condo = properties.filter(property => property.category.toLowerCase() === 'condo').length;
    const ApartmentComplex = totalProperties - Condo;

    const issues = properties.filter(property => !property.name || !property.address || !property.phone || !property.category || !property.website);

    res.json({
        totalProperties,
        availableProperties,
        unavailableProperties,
        ApartmentComplex,
        Condo,
        propertiesWithIssues: issues.length,
        issues
    });
});
app.listen(3000, () => console.log("Example app listening on port 3000!"));
