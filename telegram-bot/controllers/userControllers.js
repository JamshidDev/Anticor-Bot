
import UserModels from "../models/userModels.js";

const store = async (data) => {
    try {
        let exist_user = await UserModels.findOne({ telegramId: data.telegramId }).exec();
        if (!exist_user) {
            await UserModels.create(data)
        } else {
            await UserModels.findByIdAndUpdate(exist_user._id, data);
        }
        return {
            success:true,
            message: "Successfully created or updated",
        }
    } catch (error) {
        console.log(error)
        return {
            success:false,
            message: error,
        }
    }
}

const remove = async (telegramId) => {
    try {
        let exist_user = await UserModels.findOne({ telegramId }).exec();
        if (exist_user) {
            await UserModels.findByIdAndUpdate(exist_user._id, {
                active: false,
            });
        }
        return {
            success:true,
            message: "Successfully removed",
        }
    } catch (error) {
        console.log(error)
        return {
            success:false,
            message: error,
        }

    }
}

const getUserInfoById = async (telegramId)=>{
    try {
        let exist_user = await UserModels.findOne({telegramId}).exec();
        if (exist_user) {
            return {
                success:true,
                message: "User is exist",
                data:exist_user
            }
        } else {
            return {
                success:false,
                message: "User not found",
                data:null
            }
        }
    } catch (error) {
        console.log(error)
        return {
            success:false,
            message: error,
        }
    }
}

const setUserLanguage = async(data)=>{
    try {
        let exist_user = await UserModels.findOne({ telegramId: data.telegramId }).exec();
        let result = await UserModels.findByIdAndUpdate(exist_user._id, {
            languageCode:data.languageCode
        });
        return {
            success:true,
            message: "Successfully updated user language",
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

export default {store, remove, getUserInfoById, setUserLanguage}