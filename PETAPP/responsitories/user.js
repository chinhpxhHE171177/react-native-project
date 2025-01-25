//https://randomuser.me/api
//yarn add axios 
import axios from 'axios';
const Server = 'randomuser.me'
const urlGetUser = `https://${Server}/api`;
const getUserDetail = async () => {
    try {
        alert('Get user detail')
        let response = await axios.get(urlGetUser)
        if (response.data == 200) {
            throw 'Failed request'
        }
        if (response.data.results.length > 0) {
            let resUser = response.data.results[0]
            let user = {}
            user.dateOfBirth = new Date(resUser.dob.date)
            user.email = resUser.email
            user.gender = resUser.gender ?? 'male' //default value 
            user.userId = `${resUser.id.name}${resUser.id.value}`
            user.address = `${resUser.location.state}, ${resUser.location.street.name}`
            user.userName = resUser.login.username
            user.url = resUser.picture.large
            user.phone = resUser.phone ?? ''
            user.registerDate = new Date(resUser.registered.date)

            return user
        }
        throw 'User not found!!!'
    } catch (error) {
        throw error
    }
}

const login = ({ email, password }) => {

}

// many other function 
export default { getUserDetail, login };