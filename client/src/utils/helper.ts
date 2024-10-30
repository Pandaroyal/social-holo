import $ from 'jquery';

export const toastDisplay = async (text: string) => {
  const { toast } = await import('react-hot-toast')
  toast.success(text);
}

export const showError = (msg: string) => {
  $('#signup-error').show();
  $('#signup-error').html(msg);
  setTimeout(() => {
    $('#signup-error').hide();
  }, 3000);
}