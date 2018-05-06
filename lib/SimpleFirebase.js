class SimpleFirebase {
	constructor (appConfig = {}) {
		this.config = appConfig;

		const fbHandler = this.fbHandler = firebase.initializeApp(appConfig);

		this.Auth = fbHandler.auth();
		this.Database = new SimpleFirebase.SimpleDatabase(this);
		this.Firestore = fbHandler.firestore && fbHandler.firestore();
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
							return this.ref(path).update(val);
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