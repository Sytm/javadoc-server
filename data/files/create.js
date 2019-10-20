$.ajax('/repos', {
    dataType: 'json',
    success: (data) => {
        data.repos.forEach(e => {
            $('#selectRepo').append(new Option(e, e));
        });
    }
});

$('#go_javadoc').on('click', event => {
    console.log('giey');
    let repo = $('#selectRepo option:selected').text();
    let groupId = $('#selectGroupId').val();
    let artifactId = $('#selectArtifactId').val();
    let version = $('#selectVersion').val();
    let url = '/docs/' + repo + '/' + groupId + '/' + artifactId + '/' + version + '/';
    window.open(url, '_blank');
});