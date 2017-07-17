[{
    id: '',
    name: 'Baljot',
    room: 'the office'
}]

class Users{
    constructor(){
        this.users = [];
    }
    addUser(id, name, room){
        var user = {id, name, room};
        this.users.push(user);
        return user;
    }
    removeUser(id){
        var user = this.getUser(id);
        this.users = this.users.filter((user)=>user.id!==id);
       
        return user;
    }
    getUser(id){
        return this.users.filter((user)=>user.id===id);
        
    }
    getUserList(room){
        var users = this.users.filter((user)=> user.room===room);
        var nameArray = users.map((user)=> user.name);
        return nameArray;
    }
}
module.exports = {Users};
// class Person{
//     constructor(name, age){

//     }

//     getUserDescription(){
//         return 'method name';
//     }
// }

// var me = new Person();

