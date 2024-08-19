// Import required Firebase services
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { Firestore, getFirestore, onSnapshot, query, collection, orderBy, addDoc, doc, deleteDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdaLL9wYPQicD85Dn9s_hvJUYWlJu-VRE",
  authDomain: "movie-review-app-42c27.firebaseapp.com",
  projectId: "movie-review-app-42c27",
  storageBucket: "movie-review-app-42c27.appspot.com",
  messagingSenderId: "1033115231876",
  appId: "1:1033115231876:web:7ca76c817d0e7dcd8b44d1",
  measurementId: "G-ZEJYD9FNNH"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to render movie reviews
function renderReviews(snapshot) {
    // Empty HTML table
    $('#reviewList').empty();
    // Loop through snapshot data and add to HTML table
    snapshot.forEach((doc) => {
        const data = doc.data();
        $('#reviewList').append(`
            <tr>
                <td>${data.movie_name}</td>
                <td>${data.director_name}</td>
                <td>${data.release_date}</td>
                <td>${data.movie_rating}/5</td>
                <td>
                    <button class="btn btn-danger deleteBtn" data-id="${doc.id}">Delete</button>
                    <button class="btn btn-primary editBtn" data-id="${doc.id}">Update</button>
                </td>
            </tr>
        `);
    });
    // Display review count
    $('#mainTitle').html(snapshot.size + " movie rating and reviews");
}

// Get a live data snapshot (i.e. auto-refresh) of our Reviews collection
const q = query(collection(db, "Ratings"), orderBy("movie_name"));
const unsubscribe = onSnapshot(q, (snapshot) => {
    renderReviews(snapshot);
});

// Add Button Click Event
$('#addButton').click(async function () {
    const movieName = $('#movieName').val();
    const directorName = $('#directorName').val();
    const releaseDate = $('#releaseDate').val();
    const movieRating = parseInt($('#movieRating').val());
    await addDoc(collection(db, "Ratings"), {
        movie_name: movieName,
        director_name: directorName,
        release_date: releaseDate,
        movie_rating: movieRating
    });
    $('#movieName').val('');
    $('#directorName').val('');
    $('#releaseDate').val('');
    $('#movieRating').val('0');
});

// Delete Button Click Event
$(document).on('click', '.deleteBtn', async function () {
    const id = $(this).data('id');
    await deleteDoc(doc(db, "Ratings", id));
});

// Edit Button Click Event
$(document).on('click', '.editBtn', async function () {
    const id = $(this).data('id');
    const newMovieName = prompt("Enter new movie name:");
    const newDirectorName = prompt("Enter new director name:");
    const newReleaseDate = prompt("Enter new release date:");
    const newMovieRating = parseInt(prompt("Enter new movie rating (0-5):"));
    if (newMovieName !== null && newDirectorName !== null && newReleaseDate !== null && newMovieRating !== null) {
        await updateDoc(doc(db, "Ratings", id), {
            movie_name: newMovieName,
            director_name: newDirectorName,
            release_date: newReleaseDate,
            movie_rating: newMovieRating
        });
    }
});