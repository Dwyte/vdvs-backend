$(() => {
    // // Submission of Ballot
    // $('#ballot-div').on('click', '#ballot-submit-button', () => {
    //     event.preventDefault();
        
    //     // Get Voter's info for validation
    //     const voterInfo = {
    //         lrn: parseInt($('#info-form :input[name= lrn]').val()),
    //         fullName: $('#info-form :input[name= fullName]').val().replace(/\s/g, '').toLowerCase(),
    //         gradeLevel: parseInt($('#info-form :input[name= gradeLevel]').val()),
    //         section: $('#info-form :input[name= section]').val().replace(/\s/g, '').toLowerCase()
    //     }

    //     // Get all the values of all inputs [Get all the id of voted candidates]
    //     var voterVotes = $('#vote-form :input:checked').map(function(){return $(this).val();}).get();

    //     // Send PUT request
    //     $.ajax({
    //         url: '/vote/',
    //         contentType: 'application/json',
    //         method: 'PUT',
    //         data: JSON.stringify({info:voterInfo,votes: voterVotes}),
    //         success: (response) => {
    //             console.log(response);
    //             location.replace('vote/receipt/' + response);
    //         }
    //     })
    // });

    $('label').on('click', '#search-receipt-button',function() {
        var receiptID =  $('input[name=lrn]').val();
        location.replace('/vote/receipt/' + receiptID);
    });
});