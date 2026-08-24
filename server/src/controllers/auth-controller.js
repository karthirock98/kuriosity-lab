import { createResponse } from "../utils/common-utils.js"

export const logOut = async (req, res) => {
    try {
        res.json({
            statusCode: '200',
            data: null,
            message: 'Loged Out Successfully!'
        })
    } catch (error) {
        res.json({
            statusCode: '500',
            data: null,
            message: 'Something Went Wrong!'
        })
    }
}
export const logIn = async (req, res) => {
    try {
        const body = req.body;
        if(body.userName){
            res.status(200).json(createResponse(200, { userName: body?.userName, sessionTimeOut: 300 }, 'Logged in Successfully!', ''))
        }else{
            throw "Usernam eis required";
        }
    } catch (error) {
        res.status(500).json(createResponse(500, {}, error))

    }
}