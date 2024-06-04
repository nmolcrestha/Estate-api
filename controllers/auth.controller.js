import bcrypt from "bcrypt";

export const register = async(req,res) => {
    const {username, email, password} = req.body;

    const hasedPassword = await bcrypt.hash(password, 10);
    console.log(hasedPassword);

}

export const login = (req,res) => {

}

export const logout = (req,res) => {

}