angular.module('app').value('ngToastr',toastr);

angular.module('app').factory('ngNotifier',function(ngToastr) {
	return {
		notifyError: function(msg) {
			ngToastr.options = {
				'positionClass':'toast-top-full-width',
				'timeOut' : '1800'
			};
			ngToastr.error(msg);
			//console.log(msg);
		},
		notify: function(msg) {
			ngToastr.options = {
				'positionClass':'toast-top-center',
				'timeOut' : '1800'
			};
			ngToastr.success(msg);
			//console.log(msg);
		}
	}
})