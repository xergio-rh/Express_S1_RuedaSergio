export class UserRepository{
    constructor(UserModel){
        this.User= UserModel;
    }
    async create(data){
        return this.User.create(data)
    }
    async findAll(){
        return this.User.find();
    }
    async findByID(id){}
    async updatebyId(id,data){}
    async deteleById(id){}
    async findByEmail(email){}

}