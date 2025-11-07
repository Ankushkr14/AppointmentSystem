export const validateBody = (schema) => {
    return (req, res, next)=> {
        const { error } = schema.validate(req.body, { abortEarly: false} );

        if(error) {
            const messages = error.details.map((detail) => detail.message);
            return res.status(400).json({
                success: false,
                error: messages
            })
        }

        next();
    }
}