const auth = (role) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "No Authenticated" })
        }
        if (req.user.role !== role) {
            return res.status(403).send("You are not authorized to perform this action")
        }
        next()
    }
}

export default auth