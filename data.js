const REGIONS_DATA = {
    "REGION DES SAVANES": [
        {
            inspection: "IESG MANGO",
            prefectures: ["Oti", "Kpendjal"]
        },
        {
            inspection: "IESG DAPAONG",
            prefectures: ["Tône", "Cinkassé", "Tandjouaré"]
        }
    ],
    "REGION DE LA KARA": [
        {
            inspection: "IESG KARA",
            prefectures: ["Kozah", "Binah", "Assoli"]
        },
        {
            inspection: "IESG BASSAR",
            prefectures: ["Bassar", "Dankpen"]
        },
        {
            inspection: "IESG NIAMTOUGOU",
            prefectures: ["Doufelgou", "Kéran"]
        }
    ],
    "REGION CENTRALE": [
        {
            inspection: "IESG SOKODE",
            prefectures: ["Tchaoudjo", "Tchamba"]
        },
        {
            inspection: "IESG SOTOUBOUA",
            prefectures: ["Sotouboua", "Blitta"]
        }
    ],
    "REGION DES PLATEAUX": [
        {
            inspection: "IESG ATAKPAME",
            prefectures: ["Ogou", "Amou"]
        },
        {
            inspection: "IESG ANIE",
            prefectures: ["Anié", "Est-Mono"]
        },
        {
            inspection: "IESG KPALIME",
            prefectures: ["Kloto", "Agou"]
        },
        {
            inspection: "IESG ADETA",
            prefectures: ["Kpélé", "Danyi"]
        },
        {
            inspection: "IESG BADOU",
            prefectures: ["Wawa", "Akébou"]
        },
        {
            inspection: "IESG NOTSE",
            prefectures: ["Haho", "Moyen-Mono"]
        }
    ],
    "REGION MARITIME": [
        {
            inspection: "IESG TSEVIE",
            prefectures: ["Zio", "Avé"]
        },
        {
            inspection: "IESG ANEHO",
            prefectures: ["Lacs", "Bas-Mono"]
        },
        {
            inspection: "IESG VOGAN",
            prefectures: ["Vo", "Yoto"]
        }
    ],
    "REGION GOLFE/LOME": [
        {
            inspection: "IESG GOLFE EST",
            prefectures: ["Baguida", "Bè", "Amoutiévé", "Adawlato", "Ablogamè", "Gbényédzikopé", "Akodesséwa", "Adamavokopé", "Adakpamé", "Tokoin (côté Est)"]
        },
        {
            inspection: "IESG GOLFE OUEST",
            prefectures: ["Sanguéra", "Agoè (côté Ouest)", "Aflao", "Tokoin (côté Ouest)", "Nyékonakpoè", "Kodjoviakopé"]
        }
    ]
};

// --- CONFIGURATION YOUTUBE ---
// OPTION 1 : AUTOMATIQUE (Nécessite server.py lancé)
// Copiez ici l'ID de votre PLAYLIST ou de votre CHAÎNE
const PLAYLIST_ID = "PLTA0kOoQeIZiMuKmF8xleLPBFpGJEFU0n"; // <-- Votre Playlist
const CHANNEL_ID = ""; // Laissez vide si vous utilisez PLAYLIST_ID

// OPTION 2 : MANUELLE (Recommandée si l'automatisme échoue)
// Remplacez la liste ci-dessous par VOS propres vidéos.
// Format : { title: "Titre de la vidéo", id: "ID_YOUTUBE" },
// L'ID YouTube est la partie après "v=" dans l'URL (ex: https://www.youtube.com/watch?v=M7lc1UVf-VE -> ID = M7lc1UVf-VE)

let YOUTUBE_VIDEOS = [
    { title: "Enregistrements des informations de l'année scolaire", id: "qhVFiKdRQH0" },

    // Ajoutez vos autres vidéos ci-dessous :
    // { title: "Titre de la vidéo 2", id: "ID_VIDEO_2" },
];
