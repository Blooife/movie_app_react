export default class UserData {
  constructor() {
    this.uid = "";
    this.name = "";
    this.surname = "";
    this.email = "";
    this.birthDate = new Date();
    this.gender = true;
    this.country = "";
    this.city = "";
    this.about = "";
    this.phoneNumber = "";
    this.favCountry = "";
    this.favGenre = "";
    this.favorites = [];
  }
}
