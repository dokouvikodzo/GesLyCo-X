document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CONFIGURATION INITIALE & FIREBASE ---
    const firebaseConfig = {
        apiKey: "AIzaSyAsfdxUlDU2u40FwKZZUyOgLb-Xbv2oG88",
        authDomain: "formation-windev-d7154.firebaseapp.com",
        projectId: "formation-windev-d7154",
        storageBucket: "formation-windev-d7154.firebasestorage.app",
        messagingSenderId: "623154355246",
        appId: "1:623154355246:web:7a59ad63589f8cb97093bf"
    };

    if (typeof firebase !== 'undefined' && !firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = (typeof firebase !== 'undefined') ? firebase.firestore() : null;

    // --- 2. LOGIQUE DU LECTEUR YOUTUBE (Remplacement du lecteur local) ---
    // Charger l'API si elle n'est pas déjà là
    if (!document.getElementById('yt-api-script')) {
        const tag = document.createElement('script');
        tag.id = 'yt-api-script';
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Variables globales pour le lecteur
    let player;
    let currentVideoIndex = 0;

    // Fonction appelée par l'API YouTube quand elle est prête
    window.onYouTubeIframeAPIReady = function () {
        if (!document.getElementById('youtube-player')) return;

        // 1. DÉTERMINER LA SOURCE (Solution Cloud pour hébergement)
        let rssUrl = "";
        let mode = "";

        if (typeof PLAYLIST_ID !== 'undefined' && PLAYLIST_ID.trim() !== "") {
            rssUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLIST_ID}`;
            mode = "Playlist";
        } else if (typeof CHANNEL_ID !== 'undefined' && CHANNEL_ID.trim() !== "") {
            rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
            mode = "Chaîne";
        }

        // 2. CHARGEMENT VIA INTERNET (Pas besoin de server.py !)
        if (rssUrl) {
            const title = document.getElementById('videoTitle');

            // On utilise rss2json pour lire le flux YouTube sans serveur backend
            const serviceUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

            fetch(serviceUrl)
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'ok' && data.items && data.items.length > 0) {
                        YOUTUBE_VIDEOS = data.items.map((item) => {
                            let vidId = "";
                            if (item.guid && item.guid.includes(':')) {
                                vidId = item.guid.split(':')[2];
                            }
                            else if (item.link && item.link.includes('v=')) {
                                vidId = item.link.split('v=')[1].split('&')[0];
                            }

                            return {
                                title: item.title,
                                id: vidId || "M7lc1UVf-VE"
                            };
                        });
                    }
                    startPlayer();
                })
                .catch(err => {
                    console.error("Erreur API :", err);
                    startPlayer();
                });
        } else {
            startPlayer();
        }
    };

    function startPlayer() {
        if (typeof YOUTUBE_VIDEOS === 'undefined' || YOUTUBE_VIDEOS.length === 0) return;

        initializeVideoUI();

        player = new YT.Player('youtube-player', {
            height: '100%',
            width: '100%',
            videoId: YOUTUBE_VIDEOS[0].id,
            playerVars: {
                'playsinline': 1,
                'rel': 0
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }

    function initializeVideoUI() {
        const videoCombo = document.getElementById('videoCombo');

        if (videoCombo) {
            videoCombo.innerHTML = "";
            YOUTUBE_VIDEOS.forEach((v, idx) => {
                const opt = document.createElement('option');
                opt.value = idx;
                opt.textContent = v.title;
                videoCombo.appendChild(opt);
            });

            videoCombo.addEventListener('change', (e) => {
                loadVideo(parseInt(e.target.value));
            });
        }

        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                loadVideo(currentVideoIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                loadVideo(currentVideoIndex + 1);
            });
        }
    }

    function onPlayerReady(event) {
        updateVideoInfo(0);
    }

    function onPlayerStateChange(event) {
    }

    function loadVideo(index) {
        if (!player || !player.loadVideoById) return;
        if (typeof YOUTUBE_VIDEOS === 'undefined') return;

        if (index < 0) index = YOUTUBE_VIDEOS.length - 1;
        if (index >= YOUTUBE_VIDEOS.length) index = 0;

        currentVideoIndex = index;
        const vid = YOUTUBE_VIDEOS[currentVideoIndex];

        player.loadVideoById(vid.id);
        updateVideoInfo(currentVideoIndex);
    }

    function updateVideoInfo(index) {
        if (typeof YOUTUBE_VIDEOS === 'undefined') return;
        const vid = YOUTUBE_VIDEOS[index];

        const videoCombo = document.getElementById('videoCombo');
        const videoTitle = document.getElementById('videoTitle');
        const currentVideoName = document.getElementById('currentVideoName');

        if (videoCombo) videoCombo.value = index;
        if (videoTitle) videoTitle.textContent = vid.title;
        if (currentVideoName) currentVideoName.textContent = vid.title;
    }

    // --- 3. LOGIQUE DU FORMULAIRE (Page Inscription) ---
    const form = document.getElementById('inscriptionForm');
    if (form) {
        const regionSelect = document.getElementById('region');
        const inspectionSelect = document.getElementById('inspection');
        const prefectureSelect = document.getElementById('prefecture');
        const contactInput = document.getElementById('contact');
        const waModal = document.getElementById('waModal');
        const whatsappCheckbox = document.getElementById('isWhatsapp');

        if (typeof REGIONS_DATA !== 'undefined') {
            Object.keys(REGIONS_DATA).forEach(region => {
                const option = document.createElement('option');
                option.value = region;
                option.textContent = region;
                regionSelect.appendChild(option);
            });
        }

        regionSelect.addEventListener('change', (e) => {
            const selectedRegion = e.target.value;
            inspectionSelect.innerHTML = '<option value="">Sélectionnez d\'abord une région</option>';
            inspectionSelect.disabled = true;
            if (selectedRegion && REGIONS_DATA[selectedRegion]) {
                REGIONS_DATA[selectedRegion].forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.inspection;
                    option.textContent = item.inspection;
                    inspectionSelect.appendChild(option);
                });
                inspectionSelect.disabled = false;
            }
        });

        inspectionSelect.addEventListener('change', (e) => {
            const selectedInspection = e.target.value;
            const selectedRegion = regionSelect.value;
            prefectureSelect.innerHTML = '<option value="">Sélectionnez d\'abord une inspection</option>';
            prefectureSelect.disabled = true;
            if (selectedRegion && selectedInspection) {
                const inspectionData = REGIONS_DATA[selectedRegion].find(item => item.inspection === selectedInspection);
                if (inspectionData && inspectionData.prefectures) {
                    inspectionData.prefectures.forEach(pref => {
                        const option = document.createElement('option');
                        option.value = pref;
                        option.textContent = pref;
                        prefectureSelect.appendChild(option);
                    });
                    prefectureSelect.disabled = false;
                }
            }
        });

        contactInput.addEventListener('blur', () => {
            if (contactInput.value.trim().length >= 8) {
                waModal.classList.remove('hidden');
            }
        });

        document.getElementById('btnWaYes').onclick = () => { whatsappCheckbox.checked = true; waModal.classList.add('hidden'); };
        document.getElementById('btnWaNo').onclick = () => { whatsappCheckbox.checked = false; waModal.classList.add('hidden'); };

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.textContent = "Génération du code...";
            submitBtn.disabled = true;

            if (db) {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                const setupCode = Math.floor(1000 + Math.random() * 9000).toString();
                const docId = setupCode + "_" + Date.now();

                db.collection("inscriptions_logiciel_v1").doc(docId).set({
                    ...data,
                    code: setupCode,
                    status: "en_attente",
                    date: new Date().toISOString()
                })
                    .then(() => {
                        form.classList.add('hidden');
                        document.getElementById('verificationSection').classList.remove('hidden');
                        document.getElementById('displayCode').textContent = setupCode;

                        const waMessage = encodeURIComponent(`Bonjour JRDR,\n\nVoici mon code d'inscription pour GesLyCo-X : *${setupCode}*\n\nÉtablissement : ${data.nomEcole}\nDirecteur : ${data.nomDirecteur}`);
                        const waLink = `https://wa.me/22893123398?text=${waMessage}`;
                        document.getElementById('whatsappBtn').href = waLink;

                        const unsubscribe = db.collection("inscriptions_logiciel_v1").doc(docId)
                            .onSnapshot((doc) => {
                                if (doc.exists && doc.data().status === "valide") {
                                    document.getElementById('verificationSection').classList.add('hidden');
                                    document.getElementById('downloadSection').classList.remove('hidden');
                                    unsubscribe();
                                }
                            });
                    })
                    .catch(err => {
                        alert("Erreur lors de l'inscription : " + err);
                        submitBtn.textContent = "Soumettre l'inscription";
                        submitBtn.disabled = false;
                    });
            }
        });
    }

    // --- 4. LOGIQUE DES AVIS (Page Avis) ---
    const reviewsDisplay = document.getElementById('reviewsDisplay');
    const reviewForm = document.getElementById('reviewForm');
    const starRating = document.getElementById('starRating');

    if (reviewsDisplay && db) {
        db.collection("avis_logiciel").orderBy("date", "desc").limit(10).get().then(snap => {
            reviewsDisplay.innerHTML = "";
            if (snap.empty) {
                reviewsDisplay.innerHTML = '<p class="loading-text">Aucun avis pour le moment. Soyez le premier !</p>';
                return;
            }
            snap.forEach(doc => {
                const r = doc.data();
                const stars = "★".repeat(r.note) + "☆".repeat(5 - r.note);
                const card = document.createElement('div');
                card.className = 'review-card';
                card.innerHTML = `
                    <div class="review-card-header">
                        <span class="review-card-name">${r.etablissement}</span>
                        <span class="review-card-stars">${stars}</span>
                    </div>
                    <p class="review-card-comment">${r.commentaire}</p>
                    <span class="review-card-date">${new Date(r.date).toLocaleDateString('fr-FR')}</span>
                `;
                reviewsDisplay.appendChild(card);
            });
        });
    }

    if (starRating) {
        const stars = starRating.querySelectorAll('.star');
        const ratingInput = document.getElementById('ratingValue');

        stars.forEach(star => {
            star.addEventListener('click', () => {
                const val = parseInt(star.getAttribute('data-value'));
                ratingInput.value = val;
                stars.forEach(s => {
                    if (parseInt(s.getAttribute('data-value')) <= val) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
        });
        stars[0].click();
    }

    if (reviewForm && db) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('btnSubmitReview');
            const etablissement = document.getElementById('reviewerName').value;
            const commentaire = document.getElementById('reviewComment').value;
            const note = parseInt(document.getElementById('ratingValue').value);

            submitBtn.disabled = true;
            submitBtn.textContent = "Envoi...";

            db.collection("avis_logiciel").add({
                etablissement,
                commentaire,
                note,
                date: new Date().toISOString()
            }).then(() => {
                const modal = document.getElementById('reviewSuccessModal');
                if (modal) modal.classList.remove('hidden');
                reviewForm.reset();
                setTimeout(() => location.reload(), 2000);
            }).catch(err => {
                alert("Erreur lors de l'envoi : " + err);
                submitBtn.disabled = false;
                submitBtn.textContent = "Envoyer l'avis";
            });
        });

        const closeBtn = document.getElementById('btnReviewSuccessClose');
        if (closeBtn) {
            closeBtn.onclick = () => {
                document.getElementById('reviewSuccessModal').classList.add('hidden');
            };
        }
    }
});
