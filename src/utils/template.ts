export class Template {
  static collection = 'admin';
  static db = 'ace';

  public static reset(port, username, passwordHash) {
    return `mongo --quiet --port ${port} --eval '
 if(db.${this.collection}.update(
  {name:"${username}"},
  {$set: {x_shadow:"${passwordHash}"}}
  )["nMatched"] > 0) {
   print("User ${username} updated successfully");
 } else {
  print("User ${username} does not exists.");
  print("Available users:");
  db.${this.collection}.find({},{name: 1}).forEach(function(d) { print("  " + d.name); })
 }' ${this.db}`;
  }

  public static create(port, username, passwordHash, created) {
    return `mongo --quiet --port ${port} --eval '
 var admin_id = db.${this.collection}.insertOne({
  "email" : "${username}@localhost", "last_site_name" : "default", "name" : "${username}", "time_created" : NumberLong(${created}),
  "x_shadow" : "${passwordHash}"
 })["insertedId"].str;
 if (db.site.count() > 0) {
  db.site.find().forEach(function(d) {
   db.privilege.insert({ "admin_id" : admin_id, "permissions" : [ ], "role" : "admin", "site_id" : d["_id"].str });
   print("Access granted to site " + d.name)
  });
 } else {
  print("No sites available.");
 }' ${this.db}`;
  }
}
