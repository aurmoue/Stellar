export async function Fetch(callback, url)
{
    try {
        const response = await fetch(url);

        if (!response.ok) throw new Error(`Response status: ${response.status}`);

        const result = await response.json();
        callback(result)
    }
    catch (error) {
        console.error(error.message);
    }
}