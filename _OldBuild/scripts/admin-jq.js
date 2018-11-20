$(() => {
    // Nomination of Candidates
    $('#nominate-form').on('click', '#nominate-candidate', () => {

        const positionName = $('#nominate-form :input[name=position]').val();
        const candidateName = $('#nominate-form :input[name=candidatename]').val();
        const winnerQty = $('#nominate-form :input[name=quantity]').val();

        console.log(`Candidate Name: ${candidateName} Poistion: ${positionName} winnerQty ${winnerQty}`);

        // Send PUT request
        $.ajax({
            url: '/admin/nominate/',
            contentType: 'application/json',
            method: 'PUT',
            data: JSON.stringify({candidateName: candidateName, positionName: positionName, winnerQty: parseInt(winnerQty)}),
            success: (response) => {
                console.log(response);
            }
        });
    });

    // Updating Candidate Names
    $("table").on('click','.update-candidate-name', function() {
        const rowEl = $(this).parent().parent();
        const candidateID = rowEl.find('.id').text();
        const newName = rowEl.find('.name').val();
        
        console.log(`candidateid: ${candidateID} newName: ${newName}`);

        // Send PUT request
        $.ajax({
            url: '/admin/update/' + candidateID,
            contentType: 'application/json',
            method: 'PUT',
            data: JSON.stringify({newName: newName}),
            success: (response) => {
                console.log(response);
                location.reload();
            }
        })
    });

    // Removing Candidates
    $("table").on('click','.remove-candidate', function() {
        const rowEl = $(this).parent().parent();
        const candidateID = rowEl.find('.id').text();
        
        console.log(`candidateid: ${candidateID}`);

        // Send Delete request
        $.ajax({
            url: '/admin/remove/' + candidateID,
            contentType: 'application/json',
            method: 'DELETE',
            success: (response) => {
                console.log(response);
                location.reload();
            }
        })
    });
});