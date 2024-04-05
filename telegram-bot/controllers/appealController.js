
import AppealModel from "../models/appealModels.js"


const store = async (data) => {
    try {
        let number = await AppealModel.countDocuments()+1;
        let result = await AppealModel.create({
            appealNumber:number,
            fullname:data.fullname || null,
            phone:data.phone || null,
            address:data.address || null,
            appealType:data.appealType,
            appealText:data.appealText,
            appealFile:data.appealFile
        });

        return {
            success:true,
            message: "Successfully created",
            data:result,
        }
    } catch (error) {
        console.log(error)
        return {
            success:false,
            message: error,
        }
    }
}

export default {store}