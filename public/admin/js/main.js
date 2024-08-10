function editBlogForm(blog_id) {
   
    $('#edit-blog-form').attr('action', '/admin/editblog/' + blog_id); 
    
   
    $.ajax({
        url: '/admin/blog/' + blog_id,
        method: 'GET',
        success: function (res) {
            console.log(res);
            if (res.success) {
                const blog = res.data;
                const parent = $('#editBlogModal');
            
                $('#editBlogModalLabel').text("Update Blog Record");
                
           
                $('[name="title"]', parent).val(blog.title);
                $('[name="date"]', parent).val(blog.date.substring(0, 10)); 
                $('[name="content"]', parent).val(blog.content);
                
               
                parent.modal('show');
                
             
                $('#edit-blog-form').off('submit').on('submit', function (e) {
                    e.preventDefault(); 
                    
                    const actionUrl = $(this).attr('action'); 
                    const formData = $(this).serialize(); 
                    
                  
                    $.ajax({
                        url: actionUrl,
                        method: 'PUT',
                        data: formData,
                        success: function (res) {
                            if (res.success) {
                                alert('Blog updated successfully!');
                                window.location.reload(); 
                            } else {
                                console.error('Failed to update blog:', res.message);
                                alert('Error updating blog: ' + res.message);
                            }
                        },
                        error: function (xhr, status, error) {
                            console.error('Error updating blog:', error);
                            alert('An error occurred while updating the blog');
                        }
                    });
                });
                
            } else {
                console.error('Failed to retrieve blog:', res.message);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error retrieving blog:', error);
        }
    });
}


function deleteBlog(blog_id){
    if(confirm('Are you sure,you want to delete this blog...?')){
        $.ajax({
            url:'/admin/deleteblog/' + blog_id,
            method:'DELETE',
            success:function(res){
                if(res.message === 'Blog deleted successfully'){
                    alert('Blog deleted successfully!');
                    window.location.reload(); 
                }
                else{
                    console.error('Failed to delete blog:', res.message);
                    alert('Error deleting blog: ' + res.message);
                }
            },
            error:function(xhr, status, error){
                console.error('Error deleting blog:', error);
                alert('An error occurred while deleting the blog');
            }
        })
    }
}


document.addEventListener('DOMContentLoaded',function(){
    setTimeout(()=>{
       let alert = document.getElementById('errorAlert');
       if(alert){
        alert.classList.remove('show');
        alert.classList.add('fade');
       }
    },3000)
})
document.addEventListener('DOMContentLoaded',function(){
    setTimeout(()=>{
       let alert = document.getElementById('successAlert');
       if(alert){
        alert.classList.remove('show');
        alert.classList.add('fade');
       }
    },3000)
})