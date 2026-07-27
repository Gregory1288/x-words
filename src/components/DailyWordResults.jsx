import { useEffect, useState } from "react";
import { getDailyAttempt, getDailyLeaderboard, getDailyDateKey } from "../helpers/firestore";

function formatCompletionTime(totalSeconds) {
    const safeSeconds = Math.max(totalSeconds ?? 0, 0);
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatDateKey(dateKey) {
    const [year, month, day] = dateKey.split("-");

    return `${day}/${month}/${year}`;
}

function DailyWordResults({user, dateKey, onBack}) {
    const [attempt, setAttempt] = useState(null);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadDailyResults() {
            if (!user) {
                setError("You must be signed in to view Daily Word results.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const activeDateKey = dateKey || getDailyDateKey();
                const [savedAttempt, leaderboard] =
                  await Promise.all([getDailyAttempt(user.uid, activeDateKey), getDailyLeaderboard(activeDateKey),]);

                if (cancelled) return;

                setAttempt(savedAttempt);
                setPlayers(leaderboard);
            } catch (loadError) {
                console.error("Unable to load Daily Word results:", loadError);

                if (!cancelled) {
                    setError("Unable to load the Daily Word results");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadDailyResults();

        return () => {
            cancelled = true;
        };
    }, [user. dateKey]);

    const activeDateKey = dateKey || getDailyDateKey();

    return (
        <div className="daily-results-page">
            <button
                type="button"
                className="auth-button profile-back"
                onClick={onBack}
            >
                Back to Home
            </button>

            <h2>Daily Word Results</h2>

            <p className="daily-results-date">
                {formatDateKey(activeDateKey)}
            </p>

            {loading ? (
                <p>Loading Daily Word results...</p>
            ) : error ? (
                <p className="daily-results-error">
                    {error}
                </p>
            ) : (
                <>
                    <section className="your-daily-result">
                        <h3>Your Result</h3>

                        {attempt ? (
                            <div className="your-daily-result-grid">
                                <p>
                                    <span>Result</span>

                                    <strong>
                                        {attempt.won || attempt.result === "win" ? "Completed" : "Lost"}
                                    </strong>
                                </p>

                                <p>
                                    <span>Score</span>
                                    <strong>
                                        {attempt.score ?? 0}
                                    </strong>
                                </p>

                                <p>
                                    <span>Incorrect guesses</span>
                                    <strong>
                                        {formatCompletionTime(attempt.completionTimeSeconds)}
                                    </strong>
                                </p>
                            </div>
                        ) : (
                            <p>
                                No completed attempt was found.
                            </p>
                        )}
                    </section>

                    <section className="daily-leaderboard-section">
                        <h3>Today's Leaderboard</h3>

                        <p className="leaderboard-note">
                            Ranked by result, score, incorrect guesses and completion time.
                        </p>

                        {players.length === 0 ? (
                            <p>
                                No Daily Word results have been submitted yet.
                            </p>
                        ) : (
                            <div className="daily-table-wrapper">
                                <table className="leaderboard-table daily-leaderboard-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>PLayer</th>
                                            <th>Result</th>
                                            <th>Score</th>
                                            <th>Wrong</th>
                                            <th>Time</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {players.map(
                                            (player, index) => {
                                                const isCurrentUser = user && (player.userId === user.uid || player.id === user.uid);
                                                return (
                                                    <tr
                                                        key={player.id}
                                                        className={isCurrentUser ? "leaderboard-row-highlight" : ""}
                                                    >
                                                        <td>{index + 1}</td>

                                                        <td>{player.displayName || "Anonymous Player"}</td>

                                                        <td>{player.won || player.result === "win" ? "Completed" : "Lost"}</td>

                                                        <td>{player.score ?? 0}</td>

                                                        <td>{player.wrongGuesses ?? 0}</td>

                                                        <td>{formatCompletionTime(player.completionTimeSeconds)}</td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </>
            )}
        </div>
    );
}

export default DailyWordResults;