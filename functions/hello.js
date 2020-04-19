exports.handler = async (event, context) => {
    const {name} = JSON.parse(event.body) || "World";
    return {
        statusCode: 200,
        body: JSON.stringify({msg:`Hello, ${name}`})
    };
};
