export const registerController= async(req,res)=>{
    try {
        const {name,email,password,phone,addess} =req.body
        if(!name){
            return res.send({error:'Name is req'})
        }
        if(!email){
            return res.send({error:'email is req'})
        }
        if(!password){
            return res.send({error:'password is req'})
        }
        if(!phone){
            return res.send({error:'phone is req'})
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message: "error reg",
            error
        })
    }
};
