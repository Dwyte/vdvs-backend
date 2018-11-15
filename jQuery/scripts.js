$(() => {
    $('#login-form').on('click', '#register-button', () => {
        event.preventDefault();
        const lrn = $('#lrn-input').val();
        const pass = $('#pass-input').val();

        $.ajax({
            url: '/login/' + lrn,
            contentType: 'application/json',
            data: JSON.stringify({ newName: newName }),
            success: (response) => {
                console.log(response);
            }
        });
    });
})