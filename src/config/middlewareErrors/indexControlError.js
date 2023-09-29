import Error from "../../utils/customErrors/enum.js";

export default (error, req, res, next) => {
    switch (error.code) {
        case Error.INVALID_TYPE_ERROR:
            res.send({ status: "error", error: error.name, code: error.code, cause: error.cause })
            break
        default:
            res.send({ status: "error", error: "Error desconocido" })

    }
}