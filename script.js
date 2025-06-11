let debounceTimer;

document.getElementById('myForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form reload

    clearTimeout(debounceTimer); // Clear previous timer

    const inputValue = document.getElementById('myInput').value;
    document.getElementById('myInput').value = '';

    // Set debounce delay (e.g., 500ms)
    debounceTimer = setTimeout(() => {
        fetch(`https://api.github.com/users/${inputValue}`)
            .then(raw => raw.json())
            .then((data) => {
                console.log(data);
                document.getElementById('username').textContent = data.name;
                document.getElementById('followers').textContent = 'following : ' + data.following;
                document.getElementById('following').textContent = 'followers : ' + data.followers;
                document.getElementById('userImage').style.backgroundImage = `url(${data.avatar_url})`;
                document.getElementById('link').style.href = data.html_url;
                // document.getElementById('link').style.href = `url(${data.html_url})`;
            });
    }, 500); // 500ms debounce delay
});
