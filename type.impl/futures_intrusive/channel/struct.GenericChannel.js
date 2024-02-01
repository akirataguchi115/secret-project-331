(function() {var type_impls = {
"futures_intrusive":[["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-GenericChannel%3CMutexType,+T,+A%3E\" class=\"impl\"><a class=\"src rightside\" href=\"src/futures_intrusive/channel/mpmc.rs.html#401-500\">source</a><a href=\"#impl-GenericChannel%3CMutexType,+T,+A%3E\" class=\"anchor\">§</a><h3 class=\"code-header\">impl&lt;MutexType: <a class=\"trait\" href=\"lock_api/mutex/trait.RawMutex.html\" title=\"trait lock_api::mutex::RawMutex\">RawMutex</a>, T, A&gt; <a class=\"struct\" href=\"futures_intrusive/channel/struct.GenericChannel.html\" title=\"struct futures_intrusive::channel::GenericChannel\">GenericChannel</a>&lt;MutexType, T, A&gt;<span class=\"where fmt-newline\">where\n    A: <a class=\"trait\" href=\"futures_intrusive/buffer/trait.RingBuf.html\" title=\"trait futures_intrusive::buffer::RingBuf\">RingBuf</a>&lt;Item = T&gt;,</span></h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.new\" class=\"method\"><a class=\"src rightside\" href=\"src/futures_intrusive/channel/mpmc.rs.html#407-411\">source</a><h4 class=\"code-header\">pub fn <a href=\"futures_intrusive/channel/struct.GenericChannel.html#tymethod.new\" class=\"fn\">new</a>() -&gt; Self</h4></section></summary><div class=\"docblock\"><p>Creates a new Channel, utilizing the default capacity that\nthe RingBuffer in <code>A</code> provides.</p>\n</div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.with_capacity\" class=\"method\"><a class=\"src rightside\" href=\"src/futures_intrusive/channel/mpmc.rs.html#416-420\">source</a><h4 class=\"code-header\">pub fn <a href=\"futures_intrusive/channel/struct.GenericChannel.html#tymethod.with_capacity\" class=\"fn\">with_capacity</a>(capacity: <a class=\"primitive\" href=\"https://doc.rust-lang.org/1.75.0/std/primitive.usize.html\">usize</a>) -&gt; Self</h4></section></summary><div class=\"docblock\"><p>Creates a new Channel, which has storage for a <code>capacity</code> items.\nDepending on the utilized <code>RingBuf</code> type, the capacity argument might\nbe ignored and the default capacity might be utilized.</p>\n</div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.send\" class=\"method\"><a class=\"src rightside\" href=\"src/futures_intrusive/channel/mpmc.rs.html#426-432\">source</a><h4 class=\"code-header\">pub fn <a href=\"futures_intrusive/channel/struct.GenericChannel.html#tymethod.send\" class=\"fn\">send</a>(&amp;self, value: T) -&gt; <a class=\"struct\" href=\"futures_intrusive/channel/struct.ChannelSendFuture.html\" title=\"struct futures_intrusive::channel::ChannelSendFuture\">ChannelSendFuture</a>&lt;'_, MutexType, T&gt; <a href=\"#\" class=\"tooltip\" data-notable-ty=\"ChannelSendFuture&lt;&#39;_, MutexType, T&gt;\">ⓘ</a></h4></section></summary><div class=\"docblock\"><p>Returns a future that gets fulfilled when the value has been written to\nthe channel.\nIf the channel gets closed while the send is in progress, sending the\nvalue will fail, and the future will deliver the value back.</p>\n</div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.try_send\" class=\"method\"><a class=\"src rightside\" href=\"src/futures_intrusive/channel/mpmc.rs.html#444-455\">source</a><h4 class=\"code-header\">pub fn <a href=\"futures_intrusive/channel/struct.GenericChannel.html#tymethod.try_send\" class=\"fn\">try_send</a>(&amp;self, value: T) -&gt; <a class=\"enum\" href=\"https://doc.rust-lang.org/1.75.0/core/result/enum.Result.html\" title=\"enum core::result::Result\">Result</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.75.0/std/primitive.unit.html\">()</a>, <a class=\"enum\" href=\"futures_intrusive/channel/enum.TrySendError.html\" title=\"enum futures_intrusive::channel::TrySendError\">TrySendError</a>&lt;T&gt;&gt;</h4></section></summary><div class=\"docblock\"><p>Attempt to send the value without waiting.</p>\n<p>This operation is not supported for unbuffered channels and will\npanic if the capacity of the <code>RingBuf</code> is zero. The reason for this is\nthat the actual value transfer on unbuffered channels always happens\nwhen a receiving task copies the value out of the sending task while it\nis waiting. If the sending task does not wait, the value can not be\ntransferred. Since this method can therefore never yield a reasonable\nresult with unbuffered channels, it panics in order to highlight the\nuse of an inappropriate API.</p>\n</div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.receive\" class=\"method\"><a class=\"src rightside\" href=\"src/futures_intrusive/channel/mpmc.rs.html#459-465\">source</a><h4 class=\"code-header\">pub fn <a href=\"futures_intrusive/channel/struct.GenericChannel.html#tymethod.receive\" class=\"fn\">receive</a>(&amp;self) -&gt; <a class=\"struct\" href=\"futures_intrusive/channel/struct.ChannelReceiveFuture.html\" title=\"struct futures_intrusive::channel::ChannelReceiveFuture\">ChannelReceiveFuture</a>&lt;'_, MutexType, T&gt; <a href=\"#\" class=\"tooltip\" data-notable-ty=\"ChannelReceiveFuture&lt;&#39;_, MutexType, T&gt;\">ⓘ</a></h4></section></summary><div class=\"docblock\"><p>Returns a future that gets fulfilled when a value is written to the channel.\nIf the channels gets closed, the future will resolve to <code>None</code>.</p>\n</div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.try_receive\" class=\"method\"><a class=\"src rightside\" href=\"src/futures_intrusive/channel/mpmc.rs.html#468-480\">source</a><h4 class=\"code-header\">pub fn <a href=\"futures_intrusive/channel/struct.GenericChannel.html#tymethod.try_receive\" class=\"fn\">try_receive</a>(&amp;self) -&gt; <a class=\"enum\" href=\"https://doc.rust-lang.org/1.75.0/core/result/enum.Result.html\" title=\"enum core::result::Result\">Result</a>&lt;T, <a class=\"enum\" href=\"futures_intrusive/channel/enum.TryReceiveError.html\" title=\"enum futures_intrusive::channel::TryReceiveError\">TryReceiveError</a>&gt;</h4></section></summary><div class=\"docblock\"><p>Attempt to receive a value of the channel without waiting.</p>\n</div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.stream\" class=\"method\"><a class=\"src rightside\" href=\"src/futures_intrusive/channel/mpmc.rs.html#486-491\">source</a><h4 class=\"code-header\">pub fn <a href=\"futures_intrusive/channel/struct.GenericChannel.html#tymethod.stream\" class=\"fn\">stream</a>(&amp;self) -&gt; <a class=\"struct\" href=\"futures_intrusive/channel/struct.ChannelStream.html\" title=\"struct futures_intrusive::channel::ChannelStream\">ChannelStream</a>&lt;'_, MutexType, T, A&gt;</h4></section></summary><div class=\"docblock\"><p>Returns a stream that will receive values from this channel.</p>\n<p>This stream does not yield <code>None</code> when the channel is empty,\ninstead it yields <code>None</code> when it is terminated.</p>\n</div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.close\" class=\"method\"><a class=\"src rightside\" href=\"src/futures_intrusive/channel/mpmc.rs.html#497-499\">source</a><h4 class=\"code-header\">pub fn <a href=\"futures_intrusive/channel/struct.GenericChannel.html#tymethod.close\" class=\"fn\">close</a>(&amp;self) -&gt; <a class=\"enum\" href=\"futures_intrusive/channel/enum.CloseStatus.html\" title=\"enum futures_intrusive::channel::CloseStatus\">CloseStatus</a></h4></section></summary><div class=\"docblock\"><p>Closes the channel.\nAll pending and future send attempts will fail.\nReceive attempts will continue to succeed as long as there are items\nstored inside the channel. Further attempts will fail.</p>\n</div></details></div></details>",0,"futures_intrusive::channel::mpmc::if_std::Channel","futures_intrusive::channel::mpmc::LocalChannel"],["<section id=\"impl-Send-for-GenericChannel%3CMutexType,+T,+A%3E\" class=\"impl\"><a class=\"src rightside\" href=\"src/futures_intrusive/channel/mpmc.rs.html#377-382\">source</a><a href=\"#impl-Send-for-GenericChannel%3CMutexType,+T,+A%3E\" class=\"anchor\">§</a><h3 class=\"code-header\">impl&lt;MutexType: <a class=\"trait\" href=\"lock_api/mutex/trait.RawMutex.html\" title=\"trait lock_api::mutex::RawMutex\">RawMutex</a> + <a class=\"trait\" href=\"https://doc.rust-lang.org/1.75.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a>, T: <a class=\"trait\" href=\"https://doc.rust-lang.org/1.75.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a>, A&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.75.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"struct\" href=\"futures_intrusive/channel/struct.GenericChannel.html\" title=\"struct futures_intrusive::channel::GenericChannel\">GenericChannel</a>&lt;MutexType, T, A&gt;<span class=\"where fmt-newline\">where\n    A: <a class=\"trait\" href=\"futures_intrusive/buffer/trait.RingBuf.html\" title=\"trait futures_intrusive::buffer::RingBuf\">RingBuf</a>&lt;Item = T&gt; + <a class=\"trait\" href=\"https://doc.rust-lang.org/1.75.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a>,</span></h3></section>","Send","futures_intrusive::channel::mpmc::if_std::Channel","futures_intrusive::channel::mpmc::LocalChannel"],["<section id=\"impl-Sync-for-GenericChannel%3CMutexType,+T,+A%3E\" class=\"impl\"><a class=\"src rightside\" href=\"src/futures_intrusive/channel/mpmc.rs.html#384-389\">source</a><a href=\"#impl-Sync-for-GenericChannel%3CMutexType,+T,+A%3E\" class=\"anchor\">§</a><h3 class=\"code-header\">impl&lt;MutexType: <a class=\"trait\" href=\"lock_api/mutex/trait.RawMutex.html\" title=\"trait lock_api::mutex::RawMutex\">RawMutex</a> + <a class=\"trait\" href=\"https://doc.rust-lang.org/1.75.0/core/marker/trait.Sync.html\" title=\"trait core::marker::Sync\">Sync</a>, T: <a class=\"trait\" href=\"https://doc.rust-lang.org/1.75.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a>, A&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.75.0/core/marker/trait.Sync.html\" title=\"trait core::marker::Sync\">Sync</a> for <a class=\"struct\" href=\"futures_intrusive/channel/struct.GenericChannel.html\" title=\"struct futures_intrusive::channel::GenericChannel\">GenericChannel</a>&lt;MutexType, T, A&gt;<span class=\"where fmt-newline\">where\n    A: <a class=\"trait\" href=\"futures_intrusive/buffer/trait.RingBuf.html\" title=\"trait futures_intrusive::buffer::RingBuf\">RingBuf</a>&lt;Item = T&gt;,</span></h3></section>","Sync","futures_intrusive::channel::mpmc::if_std::Channel","futures_intrusive::channel::mpmc::LocalChannel"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-Debug-for-GenericChannel%3CMutexType,+T,+A%3E\" class=\"impl\"><a class=\"src rightside\" href=\"src/futures_intrusive/channel/mpmc.rs.html#391-399\">source</a><a href=\"#impl-Debug-for-GenericChannel%3CMutexType,+T,+A%3E\" class=\"anchor\">§</a><h3 class=\"code-header\">impl&lt;MutexType: <a class=\"trait\" href=\"lock_api/mutex/trait.RawMutex.html\" title=\"trait lock_api::mutex::RawMutex\">RawMutex</a>, T, A&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.75.0/core/fmt/trait.Debug.html\" title=\"trait core::fmt::Debug\">Debug</a> for <a class=\"struct\" href=\"futures_intrusive/channel/struct.GenericChannel.html\" title=\"struct futures_intrusive::channel::GenericChannel\">GenericChannel</a>&lt;MutexType, T, A&gt;<span class=\"where fmt-newline\">where\n    A: <a class=\"trait\" href=\"futures_intrusive/buffer/trait.RingBuf.html\" title=\"trait futures_intrusive::buffer::RingBuf\">RingBuf</a>&lt;Item = T&gt;,</span></h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.fmt\" class=\"method trait-impl\"><a class=\"src rightside\" href=\"src/futures_intrusive/channel/mpmc.rs.html#396-398\">source</a><a href=\"#method.fmt\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"https://doc.rust-lang.org/1.75.0/core/fmt/trait.Debug.html#tymethod.fmt\" class=\"fn\">fmt</a>(&amp;self, f: &amp;mut <a class=\"struct\" href=\"https://doc.rust-lang.org/1.75.0/core/fmt/struct.Formatter.html\" title=\"struct core::fmt::Formatter\">Formatter</a>&lt;'_&gt;) -&gt; <a class=\"type\" href=\"https://doc.rust-lang.org/1.75.0/core/fmt/type.Result.html\" title=\"type core::fmt::Result\">Result</a></h4></section></summary><div class='docblock'>Formats the value using the given formatter. <a href=\"https://doc.rust-lang.org/1.75.0/core/fmt/trait.Debug.html#tymethod.fmt\">Read more</a></div></details></div></details>","Debug","futures_intrusive::channel::mpmc::if_std::Channel","futures_intrusive::channel::mpmc::LocalChannel"]]
};if (window.register_type_impls) {window.register_type_impls(type_impls);} else {window.pending_type_impls = type_impls;}})()