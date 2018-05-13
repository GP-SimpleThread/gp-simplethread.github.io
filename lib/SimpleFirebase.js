class SimpleFirebase {
	constructor (appConfig = {}) {
		this.config = appConfig;

		const fbHandler = this.fbHandler = firebase.initializeApp(appConfig);

		this.Auth = fbHandler.auth();
		this.Database = new SimpleFirebase.SimpleDatabase(this);
		this.Firestore = fbHandler.firestore && new SimpleFirebase.SimpleFirestore(this);
		this.Storage = fbHandler.storage();
		this.Messaging = fbHandler.messaging();
	}

	signOut () {
		this.Auth.signOut();
	}

	static get SimpleDatabase () {
		return class SimpleDatabase {
			constructor (simpleFbObj) {
				const self = Object.create(simpleFbObj.fbHandler.database(), {
					getInfo: {
						/**
						 * @param {String} path
						 * @param {Function} callback
						 * 
						 * @returns {Promise<firebase.database.DataSnapshot> | null}
						 */
						value (path, callback) {
							if (!path) throw TypeError("1st argument, 'path' is required.");

							if (!callback) {
								return this.ref(path).once("value");
							} else {
								this.ref(path).on("value", callback);
							}
						}
					},

					get: {
						/**
						 * @param {String} path
						 * @param {Function} callback
						 * 
						 * @returns {Promise<any> | null}
						 */
						value (path, callback) {
							if (!path) throw TypeError("1st argument, 'path' is required.");

							if (!callback) {
								return this.ref(path).once("value").then(snap => snap.val());
							} else {
								this.ref(path).on("value", snap => callback(snap.val()));
							}
						},
					},

					set: {
						/**
						 * @param {String} path
						 * @param {any} [value=""]
						 * 
						 * @returns {Promise<void>}
						 */
						value (path, value = "") {
							if (!path) throw TypeError("1st argument, 'path' is required.");
							return this.ref(path).set(value);
						}
					},

					update: {
						/**
						 * @param {String} path
						 * @param {any} [value=""]
						 * 
						 * @returns {Promise<void>}
						 */
						value (path, value = "") {
							if (!path) throw TypeError("1st argument, 'path' is required.");
							return this.ref(path).update(value);
						}
					},

					push: {
						/**
						 * @param {String} path
						 * @param {any} [value=""]
						 * 
						 * @returns {firebase.database.ThenableReference}
						 */
						value (path, value = "") {
							if (!path) throw TypeError("1st argument, 'path' is required.");
							return this.ref(path).push(value);
						}
					},

					transaction: {
						/**
						 * @param {String} path
						 * @param {Function} [callback=currentValue => {}]
						 * 
						 * @returns {Promise<{ committed: Boolean, snapshot: firebase.database.DataSnapshot }>}
						 */
						value (path, callback = currentValue => {}) {
							if (!path) throw TypeError("1st argument, 'path' is required.");

							let counter = 0;
							return this.ref(path).transaction(callback);
						}
					},

					remove: {
						/**
						 * @param {String} path
						 * @returns {Promise<void>}
						 */
						value (path) {
							if (!path) throw TypeError("1st argument, 'path' is required.");
							return this.ref(path).remove();
						}
					},

					setPriority: {
						/**
						 * @param {String} path
						 * @param {Number} [priority=0]
						 * 
						 * @returns {Promise<void>}
						 */
						value (path, priority = 0) {
							if (!path) throw TypeError("1st argument, 'path' is required.");
							return this.ref(path).setPriority(priority);
						}
					}
				});

				return self;
			}
		};
	}

	static get SimpleFirestore () {
		return class SimpleFirestore {
			constructor (simpleFbObj) {
				const self = Object.create(simpleFbObj.fbHandler.firestore(), {
					ref: {
						/**
						 * @param {String} path
						 * @returns {firebase.firestore.CollectionReference | firebase.firestore.DocumentReference}
						 */
						value (path) {
							if (!path) throw new TypeError("1st argument, 'path' is required");

							const segments = path.split("/").filter(name => name);

							if (segments.length % 2) {
								return this.collection(path);
							} else {
								return this.doc(path);
							}
						}
					},

					get: {
						/**
						 * @param {String} path
						 * @param {Function<firebase.firestore.QuerySnapshot | firebase.firestore.DocumentSnapshot>} callback
						 * 
						 * @returns {Promise<firebase.firestore.QuerySnapshot | firebase.firestore.DocumentSnapshot> | Function}
						 */
						value (path, callback) {
							if (!callback) {
								return this.ref(path).get();
							} else {
								return this.ref(path).onSnapshot(callback);
							}
						}
					},

					getValue: {
						/**
						 * @param {String} path
						 * @param {Function<Array<firebase.firestore.QueryDocumentSnapshot> | Object>} callback
						 * 
						 * @returns {Promise<Array<firebase.firestore.QueryDocumentSnapshot> | Object>}
						 */
						value (path, callback) {
							if (!callback) {
								return this.get(path).then(snapshot => snapshot.id ? snapshot.data() : snapshot.docs);
							} else {
								return this.ref(path).onSnapshot(snapshot => snapshot.id ? snapshot.data() : snapshot.docs);
							}
						}
					},

					exist: {
						/**
						 * @param {String} path
						 * @returns {Promise<Boolean>}
						 */
						value (path) {
							return this.get(path).then(snapshot => snapshot.id ? snapshot.exists : !snapshot.empty);
						}
					},

					add: {
						/**
						 * @param {String} path
						 * @param {Object} [value={}]
						 * 
						 * @returns {Promise<firebase.firestore.DocumentReference>}
						 */
						value (path, value = {}) {
							return this.collection(path).add(value);
						}
					},

					set: {
						/**
						 * @param {String} path
						 * @param {Object} [value={}]
						 * 
						 * @returns {Promise<void>}
						 */
						value (path, value = {}) {
							return this.doc(path).set(value);
						}
					},

					merge: {
						/**
						 * @param {String} path
						 * @param {Object} [value={}]
						 * 
						 * @returns {Promise<void>}
						 */
						value (path, value = {}) {
							return this.doc(path).set(value, { merge: true });
						}
					},

					update: {
						/**
						 * @param {String} path
						 * @param {Object} [value={}]
						 * 
						 * @returns {Promise<void>}
						 */
						value (path, value = {}) {
							return this.doc(path).update(value);
						}
					},

					delete: {
						/**
						 * @param {String} path
						 * @param {Array<String>} fields
						 * 
						 * @returns {Promise<void>}
						 */
						value (path, fields) {
							if (!fields) return this.doc(path).delete();

							const children = {};
							fields.forEach(field => children[field] = firebase.firestore.FieldValue.delete());

							return this.update(path, children);
						}
					},

					transaction: {
						/**
						 * @param {firebase.firestore.DocumentReference} ref
						 * @param {Function<firebase.firestore.Transaction, firebase.firestore.DocumentSnapshot>} callback
						 * 
						 * @returns {Promise}
						 */
						value (ref, callback) {
							return this.runTransaction(transaction => {
								return transaction.get(ref).then(snapshot => {
									return callback(transaction, snapshot);
								});
							});
						}
					}
				});

				self.settings({ timestampsInSnapshots: true });

				return self;
			}
		};
	}
}

class SimpleFirebaseUI {
	static get SIGNINTYPE () { return firebaseui.auth.CredentialHelper; }



	//https://github.com/firebase/firebaseui-web#configuration
	constructor (authObj, parentSelector = "Body") {
		this.config = { signInOptions: [], callbacks: {} };
		this.selector = parentSelector;
		
		this.fbUiHandler = new firebaseui.auth.AuthUI(authObj);
	}

	get signInType () { return this.config.credentialHelper; }
	set signInType (type = SimpleFirebaseUI.SIGNINTYPE.ACCOUNT_CHOOSER_COM) { this.config.credentialHelper = type; }

	get flowType () { return this.config.signInFlow; }
	set flowType (type = "redirect") { this.config.signInFlow = type; }

	get termUrl () { return this.config.tosUrl; }
	set termUrl (url = "") { this.config.tosUrl = url; }

	on (callbackName = "", callback = () => {}) {
		this.config.callbacks[callbackName] = callback;
		return this;
	}

	signInWithGoogle (providerConfig = {}) {
		this.config.signInOptions.push(
			Object.assign({ provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID }, providerConfig)
		);

		return this;
	}

	start () {
		this.fbUiHandler.start(this.selector, this.config);
	}
}