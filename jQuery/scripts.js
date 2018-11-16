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

    $('#vote-form').on('click', '#vote-submit-button', () => {
        event.preventDefault();
        const votedForPresident = $('input[name=pres]:checked', '#vote-form').val();
        
        $.ajax({
            url: '/vote/' + votedForPresident,
            contentType: 'application/json',
            method: 'PUT',
            success: (response) => {
                console.log(response);
            }
        })
    })
})