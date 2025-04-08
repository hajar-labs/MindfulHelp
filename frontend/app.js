// Fetch resources from the backend
const fetchResources = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/resources');
        const data = await response.json();
        console.log(data);

        // Display resources in the UI
        const resourceList = document.getElementById('resource-list');
        resourceList.innerHTML = data.map(resource => `
            <li>
                <h3>${resource.title}</h3>
                <p>${resource.content}</p>
            </li>
        `).join('');
    } catch (err) {
        console.error('Error fetching resources:', err);
    }
};

// Add event listener to the button
document.getElementById('fetch-resources').addEventListener('click', fetchResources);

