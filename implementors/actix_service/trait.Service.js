(function() {var implementors = {};
implementors["actix_files"] = [{"text":"impl <a class=\"trait\" href=\"actix_service/trait.Service.html\" title=\"trait actix_service::Service\">Service</a>&lt;<a class=\"struct\" href=\"actix_web/service/struct.ServiceRequest.html\" title=\"struct actix_web::service::ServiceRequest\">ServiceRequest</a>&gt; for <a class=\"struct\" href=\"actix_files/struct.FilesService.html\" title=\"struct actix_files::FilesService\">FilesService</a>","synthetic":false,"types":["actix_files::service::FilesService"]}];
implementors["actix_http"] = [{"text":"impl <a class=\"trait\" href=\"actix_service/trait.Service.html\" title=\"trait actix_service::Service\">Service</a>&lt;<a class=\"struct\" href=\"actix_http/struct.Request.html\" title=\"struct actix_http::Request\">Request</a>&lt;<a class=\"struct\" href=\"https://doc.rust-lang.org/1.63.0/core/pin/struct.Pin.html\" title=\"struct core::pin::Pin\">Pin</a>&lt;<a class=\"struct\" href=\"https://doc.rust-lang.org/1.63.0/alloc/boxed/struct.Box.html\" title=\"struct alloc::boxed::Box\">Box</a>&lt;dyn <a class=\"trait\" href=\"futures_core/stream/trait.Stream.html\" title=\"trait futures_core::stream::Stream\">Stream</a>&lt;Item = <a class=\"enum\" href=\"https://doc.rust-lang.org/1.63.0/core/result/enum.Result.html\" title=\"enum core::result::Result\">Result</a>&lt;<a class=\"struct\" href=\"bytes/bytes/struct.Bytes.html\" title=\"struct bytes::bytes::Bytes\">Bytes</a>, <a class=\"enum\" href=\"actix_http/error/enum.PayloadError.html\" title=\"enum actix_http::error::PayloadError\">PayloadError</a>&gt;&gt; + 'static, <a class=\"struct\" href=\"https://doc.rust-lang.org/1.63.0/alloc/alloc/struct.Global.html\" title=\"struct alloc::alloc::Global\">Global</a>&gt;&gt;&gt;&gt; for <a class=\"struct\" href=\"actix_http/h1/struct.ExpectHandler.html\" title=\"struct actix_http::h1::ExpectHandler\">ExpectHandler</a>","synthetic":false,"types":["actix_http::h1::expect::ExpectHandler"]},{"text":"impl&lt;T&gt; <a class=\"trait\" href=\"actix_service/trait.Service.html\" title=\"trait actix_service::Service\">Service</a>&lt;(<a class=\"struct\" href=\"actix_http/struct.Request.html\" title=\"struct actix_http::Request\">Request</a>&lt;<a class=\"struct\" href=\"https://doc.rust-lang.org/1.63.0/core/pin/struct.Pin.html\" title=\"struct core::pin::Pin\">Pin</a>&lt;<a class=\"struct\" href=\"https://doc.rust-lang.org/1.63.0/alloc/boxed/struct.Box.html\" title=\"struct alloc::boxed::Box\">Box</a>&lt;dyn <a class=\"trait\" href=\"futures_core/stream/trait.Stream.html\" title=\"trait futures_core::stream::Stream\">Stream</a>&lt;Item = <a class=\"enum\" href=\"https://doc.rust-lang.org/1.63.0/core/result/enum.Result.html\" title=\"enum core::result::Result\">Result</a>&lt;<a class=\"struct\" href=\"bytes/bytes/struct.Bytes.html\" title=\"struct bytes::bytes::Bytes\">Bytes</a>, <a class=\"enum\" href=\"actix_http/error/enum.PayloadError.html\" title=\"enum actix_http::error::PayloadError\">PayloadError</a>&gt;&gt; + 'static, <a class=\"struct\" href=\"https://doc.rust-lang.org/1.63.0/alloc/alloc/struct.Global.html\" title=\"struct alloc::alloc::Global\">Global</a>&gt;&gt;&gt;, <a class=\"struct\" href=\"actix_codec/framed/struct.Framed.html\" title=\"struct actix_codec::framed::Framed\">Framed</a>&lt;T, <a class=\"struct\" href=\"actix_http/h1/struct.Codec.html\" title=\"struct actix_http::h1::Codec\">Codec</a>&gt;)&gt; for <a class=\"struct\" href=\"actix_http/h1/struct.UpgradeHandler.html\" title=\"struct actix_http::h1::UpgradeHandler\">UpgradeHandler</a>","synthetic":false,"types":["actix_http::h1::upgrade::UpgradeHandler"]}];
implementors["actix_service"] = [];
implementors["actix_web"] = [];
if (window.register_implementors) {window.register_implementors(implementors);} else {window.pending_implementors = implementors;}})()