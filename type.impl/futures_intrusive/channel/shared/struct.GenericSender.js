(function() {var type_impls = {
"futures_intrusive":[["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-GenericSender%3CMutexType,+T,+A%3E\" class=\"impl\"><a class=\"src rightside\" href=\"src/futures_intrusive/channel/mpmc.rs.html#906-944\">source</a><a href=\"#impl-GenericSender%3CMutexType,+T,+A%3E\" class=\"anchor\">§</a><h3 class=\"code-header\">impl&lt;MutexType, T, A&gt; <a class=\"struct\" href=\"futures_intrusive/channel/shared/struct.GenericSender.html\" title=\"struct futures_intrusive::channel::shared::GenericSender\">GenericSender</a>&lt;MutexType, T, A&gt;<span class=\"where fmt-newline\">where\n    MutexType: 'static + <a class=\"trait\" href=\"lock_api/mutex/trait.RawMutex.html\" title=\"trait lock_api::mutex::RawMutex\">RawMutex</a>,\n    A: 'static + <a class=\"trait\" href=\"futures_intrusive/buffer/trait.RingBuf.html\" title=\"trait futures_intrusive::buffer::RingBuf\">RingBuf</a>&lt;Item = T&gt;,</span></h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.send\" class=\"method\"><a class=\"src rightside\" href=\"src/futures_intrusive/channel/mpmc.rs.html#915-921\">source</a><h4 class=\"code-header\">pub fn <a href=\"futures_intrusive/channel/shared/struct.GenericSender.html#tymethod.send\" class=\"fn\">send</a>(&amp;self, value: T) -&gt; <a class=\"struct\" href=\"futures_intrusive/channel/shared/struct.ChannelSendFuture.html\" title=\"struct futures_intrusive::channel::shared::ChannelSendFuture\">ChannelSendFuture</a>&lt;MutexType, T&gt; <a href=\"#\" class=\"tooltip\" data-notable-ty=\"ChannelSendFuture&lt;MutexType, T&gt;\">ⓘ</a></h4></section></summary><div class=\"docblock\"><p>Returns a future that gets fulfilled when the value has been written to\nthe channel.\nIf the channel gets closed while the send is in progress, sending the\nvalue will fail, and the future will deliver the value back.</p>\n</div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.try_send\" class=\"method\"><a class=\"src rightside\" href=\"src/futures_intrusive/channel/mpmc.rs.html#933-935\">source</a><h4 class=\"code-header\">pub fn <a href=\"futures_intrusive/channel/shared/struct.GenericSender.html#tymethod.try_send\" class=\"fn\">try_send</a>(&amp;self, value: T) -&gt; <a class=\"enum\" href=\"https://doc.rust-lang.org/1.75.0/core/result/enum.Result.html\" title=\"enum core::result::Result\">Result</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.75.0/std/primitive.unit.html\">()</a>, <a class=\"enum\" href=\"futures_intrusive/channel/enum.TrySendError.html\" title=\"enum futures_intrusive::channel::TrySendError\">TrySendError</a>&lt;T&gt;&gt;</h4></section></summary><div class=\"docblock\"><p>Attempt to send the value without waiting.</p>\n<p>This operation is not supported for unbuffered channels and will\npanic if the capacity of the <code>RingBuf</code> is zero. The reason for this is\nthat the actual value transfer on unbuffered channels always happens\nwhen a receiving task copies the value out of the sending task while it\nis waiting. If the sending task does not wait, the value can not be\ntransferred. Since this method can therefore never yield a reasonable\nresult with unbuffered channels, it panics in order to highlight the\nuse of an inappropriate API.</p>\n</div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.close\" class=\"method\"><a class=\"src rightside\" href=\"src/futures_intrusive/channel/mpmc.rs.html#941-943\">source</a><h4 class=\"code-header\">pub fn <a href=\"futures_intrusive/channel/shared/struct.GenericSender.html#tymethod.close\" class=\"fn\">close</a>(&amp;self) -&gt; <a class=\"enum\" href=\"futures_intrusive/channel/enum.CloseStatus.html\" title=\"enum futures_intrusive::channel::CloseStatus\">CloseStatus</a></h4></section></summary><div class=\"docblock\"><p>Closes the channel.\nAll pending future send attempts will fail.\nReceive attempts will continue to succeed as long as there are items\nstored inside the channel. Further attempts will return <code>None</code>.</p>\n</div></details></div></details>",0,"futures_intrusive::channel::mpmc::if_alloc::shared::if_std::Sender","futures_intrusive::channel::mpmc::if_alloc::shared::if_std::UnbufferedSender"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-Clone-for-GenericSender%3CMutexType,+T,+A%3E\" class=\"impl\"><a class=\"src rightside\" href=\"src/futures_intrusive/channel/mpmc.rs.html#801-816\">source</a><a href=\"#impl-Clone-for-GenericSender%3CMutexType,+T,+A%3E\" class=\"anchor\">§</a><h3 class=\"code-header\">impl&lt;MutexType, T, A&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.75.0/core/clone/trait.Clone.html\" title=\"trait core::clone::Clone\">Clone</a> for <a class=\"struct\" href=\"futures_intrusive/channel/shared/struct.GenericSender.html\" title=\"struct futures_intrusive::channel::shared::GenericSender\">GenericSender</a>&lt;MutexType, T, A&gt;<span class=\"where fmt-newline\">where\n    MutexType: <a class=\"trait\" href=\"lock_api/mutex/trait.RawMutex.html\" title=\"trait lock_api::mutex::RawMutex\">RawMutex</a>,\n    A: <a class=\"trait\" href=\"futures_intrusive/buffer/trait.RingBuf.html\" title=\"trait futures_intrusive::buffer::RingBuf\">RingBuf</a>&lt;Item = T&gt;,</span></h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.clone\" class=\"method trait-impl\"><a class=\"src rightside\" href=\"src/futures_intrusive/channel/mpmc.rs.html#806-815\">source</a><a href=\"#method.clone\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"https://doc.rust-lang.org/1.75.0/core/clone/trait.Clone.html#tymethod.clone\" class=\"fn\">clone</a>(&amp;self) -&gt; Self</h4></section></summary><div class='docblock'>Returns a copy of the value. <a href=\"https://doc.rust-lang.org/1.75.0/core/clone/trait.Clone.html#tymethod.clone\">Read more</a></div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.clone_from\" class=\"method trait-impl\"><span class=\"rightside\"><span class=\"since\" title=\"Stable since Rust version 1.0.0\">1.0.0</span> · <a class=\"src\" href=\"https://doc.rust-lang.org/1.75.0/src/core/clone.rs.html#169\">source</a></span><a href=\"#method.clone_from\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"https://doc.rust-lang.org/1.75.0/core/clone/trait.Clone.html#method.clone_from\" class=\"fn\">clone_from</a>(&amp;mut self, source: <a class=\"primitive\" href=\"https://doc.rust-lang.org/1.75.0/std/primitive.reference.html\">&amp;Self</a>)</h4></section></summary><div class='docblock'>Performs copy-assignment from <code>source</code>. <a href=\"https://doc.rust-lang.org/1.75.0/core/clone/trait.Clone.html#method.clone_from\">Read more</a></div></details></div></details>","Clone","futures_intrusive::channel::mpmc::if_alloc::shared::if_std::Sender","futures_intrusive::channel::mpmc::if_alloc::shared::if_std::UnbufferedSender"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-Debug-for-GenericSender%3CMutexType,+T,+A%3E\" class=\"impl\"><a class=\"src rightside\" href=\"src/futures_intrusive/channel/mpmc.rs.html#781-789\">source</a><a href=\"#impl-Debug-for-GenericSender%3CMutexType,+T,+A%3E\" class=\"anchor\">§</a><h3 class=\"code-header\">impl&lt;MutexType, T, A&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.75.0/core/fmt/trait.Debug.html\" title=\"trait core::fmt::Debug\">Debug</a> for <a class=\"struct\" href=\"futures_intrusive/channel/shared/struct.GenericSender.html\" title=\"struct futures_intrusive::channel::shared::GenericSender\">GenericSender</a>&lt;MutexType, T, A&gt;<span class=\"where fmt-newline\">where\n    MutexType: <a class=\"trait\" href=\"lock_api/mutex/trait.RawMutex.html\" title=\"trait lock_api::mutex::RawMutex\">RawMutex</a>,\n    A: <a class=\"trait\" href=\"futures_intrusive/buffer/trait.RingBuf.html\" title=\"trait futures_intrusive::buffer::RingBuf\">RingBuf</a>&lt;Item = T&gt;,</span></h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.fmt\" class=\"method trait-impl\"><a class=\"src rightside\" href=\"src/futures_intrusive/channel/mpmc.rs.html#786-788\">source</a><a href=\"#method.fmt\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"https://doc.rust-lang.org/1.75.0/core/fmt/trait.Debug.html#tymethod.fmt\" class=\"fn\">fmt</a>(&amp;self, f: &amp;mut <a class=\"struct\" href=\"https://doc.rust-lang.org/1.75.0/core/fmt/struct.Formatter.html\" title=\"struct core::fmt::Formatter\">Formatter</a>&lt;'_&gt;) -&gt; <a class=\"type\" href=\"https://doc.rust-lang.org/1.75.0/core/fmt/type.Result.html\" title=\"type core::fmt::Result\">Result</a></h4></section></summary><div class='docblock'>Formats the value using the given formatter. <a href=\"https://doc.rust-lang.org/1.75.0/core/fmt/trait.Debug.html#tymethod.fmt\">Read more</a></div></details></div></details>","Debug","futures_intrusive::channel::mpmc::if_alloc::shared::if_std::Sender","futures_intrusive::channel::mpmc::if_alloc::shared::if_std::UnbufferedSender"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-Drop-for-GenericSender%3CMutexType,+T,+A%3E\" class=\"impl\"><a class=\"src rightside\" href=\"src/futures_intrusive/channel/mpmc.rs.html#818-832\">source</a><a href=\"#impl-Drop-for-GenericSender%3CMutexType,+T,+A%3E\" class=\"anchor\">§</a><h3 class=\"code-header\">impl&lt;MutexType, T, A&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.75.0/core/ops/drop/trait.Drop.html\" title=\"trait core::ops::drop::Drop\">Drop</a> for <a class=\"struct\" href=\"futures_intrusive/channel/shared/struct.GenericSender.html\" title=\"struct futures_intrusive::channel::shared::GenericSender\">GenericSender</a>&lt;MutexType, T, A&gt;<span class=\"where fmt-newline\">where\n    MutexType: <a class=\"trait\" href=\"lock_api/mutex/trait.RawMutex.html\" title=\"trait lock_api::mutex::RawMutex\">RawMutex</a>,\n    A: <a class=\"trait\" href=\"futures_intrusive/buffer/trait.RingBuf.html\" title=\"trait futures_intrusive::buffer::RingBuf\">RingBuf</a>&lt;Item = T&gt;,</span></h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.drop\" class=\"method trait-impl\"><a class=\"src rightside\" href=\"src/futures_intrusive/channel/mpmc.rs.html#823-831\">source</a><a href=\"#method.drop\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"https://doc.rust-lang.org/1.75.0/core/ops/drop/trait.Drop.html#tymethod.drop\" class=\"fn\">drop</a>(&amp;mut self)</h4></section></summary><div class='docblock'>Executes the destructor for this type. <a href=\"https://doc.rust-lang.org/1.75.0/core/ops/drop/trait.Drop.html#tymethod.drop\">Read more</a></div></details></div></details>","Drop","futures_intrusive::channel::mpmc::if_alloc::shared::if_std::Sender","futures_intrusive::channel::mpmc::if_alloc::shared::if_std::UnbufferedSender"]]
};if (window.register_type_impls) {window.register_type_impls(type_impls);} else {window.pending_type_impls = type_impls;}})()