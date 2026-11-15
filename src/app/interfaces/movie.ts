export interface Genre {
    id: number;
    name: string;
}

export interface Movie {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;

    // Champs envoyés seulement par la page détail de TMDB
    genres?: Genre[];
    runtime?: number;
    tagline?: string;

    // Champs ajoutés par Rania Pictures pour la watchlist
    seen?: boolean;
    myRating?: number;
}

export interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

export interface Video {
    key: string;
    name: string;
    site: string;
    type: string;
}
