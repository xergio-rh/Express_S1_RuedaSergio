export class UserService{
    constructor(UserRepository){
        this.repo=UserRepository
    }

    async createUser(data){
        //logica paraque cuando se ingrese el correo este no este existente
    }
    async listUSer(){
        //limitar a exportar maximo 10
    }
    async getUser(id){
        return this.repo.findById(id);
    }
    async updateUser(id,dto){}

}