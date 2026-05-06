import BestRatedMovies from "../components/homeComponents/bestRatedMovies";
import MostPopularMovies from "../components/homeComponents/mostPopularMovies";
import LatestMovies from "../components/homeComponents/latestMovies";

export default function Home() {

    return (
        <>
            <BestRatedMovies />
            <MostPopularMovies />
            <LatestMovies />
        </>
    );
}