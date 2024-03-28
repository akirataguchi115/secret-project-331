(function() {var type_impls = {
"futures_intrusive":[["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-GenericSharedSemaphore%3CMutexType%3E\" class=\"impl\"><a class=\"src rightside\" href=\"src/futures_intrusive/sync/semaphore.rs.html#752-823\">source</a><a href=\"#impl-GenericSharedSemaphore%3CMutexType%3E\" class=\"anchor\">§</a><h3 class=\"code-header\">impl&lt;MutexType: <a class=\"trait\" href=\"lock_api/mutex/trait.RawMutex.html\" title=\"trait lock_api::mutex::RawMutex\">RawMutex</a>&gt; <a class=\"struct\" href=\"futures_intrusive/sync/struct.GenericSharedSemaphore.html\" title=\"struct futures_intrusive::sync::GenericSharedSemaphore\">GenericSharedSemaphore</a>&lt;MutexType&gt;</h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.new\" class=\"method\"><a class=\"src rightside\" href=\"src/futures_intrusive/sync/semaphore.rs.html#756-765\">source</a><h4 class=\"code-header\">pub fn <a href=\"futures_intrusive/sync/struct.GenericSharedSemaphore.html#tymethod.new\" class=\"fn\">new</a>(is_fair: <a class=\"primitive\" href=\"https://doc.rust-lang.org/1.76.0/std/primitive.bool.html\">bool</a>, permits: <a class=\"primitive\" href=\"https://doc.rust-lang.org/1.76.0/std/primitive.usize.html\">usize</a>) -&gt; <a class=\"struct\" href=\"futures_intrusive/sync/struct.GenericSharedSemaphore.html\" title=\"struct futures_intrusive::sync::GenericSharedSemaphore\">GenericSharedSemaphore</a>&lt;MutexType&gt;</h4></section></summary><div class=\"docblock\"><p>Creates a new futures-aware shared semaphore.</p>\n<p>See <code>GenericSharedSemaphore</code> for more information.</p>\n</div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.acquire\" class=\"method\"><a class=\"src rightside\" href=\"src/futures_intrusive/sync/semaphore.rs.html#773-782\">source</a><h4 class=\"code-header\">pub fn <a href=\"futures_intrusive/sync/struct.GenericSharedSemaphore.html#tymethod.acquire\" class=\"fn\">acquire</a>(\n    &amp;self,\n    nr_permits: <a class=\"primitive\" href=\"https://doc.rust-lang.org/1.76.0/std/primitive.usize.html\">usize</a>\n) -&gt; <a class=\"struct\" href=\"futures_intrusive/sync/struct.GenericSharedSemaphoreAcquireFuture.html\" title=\"struct futures_intrusive::sync::GenericSharedSemaphoreAcquireFuture\">GenericSharedSemaphoreAcquireFuture</a>&lt;MutexType&gt; <a href=\"#\" class=\"tooltip\" data-notable-ty=\"GenericSharedSemaphoreAcquireFuture&lt;MutexType&gt;\">ⓘ</a></h4></section></summary><div class=\"docblock\"><p>Acquire a certain amount of permits on a semaphore asynchronously.</p>\n<p>This method returns a future that will resolve once the given amount of\npermits have been acquired.\nThe Future will resolve to a <a href=\"futures_intrusive/sync/struct.GenericSharedSemaphoreReleaser.html\" title=\"struct futures_intrusive::sync::GenericSharedSemaphoreReleaser\"><code>GenericSharedSemaphoreReleaser</code></a>, which will\nrelease all acquired permits automatically when dropped.</p>\n</div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.try_acquire\" class=\"method\"><a class=\"src rightside\" href=\"src/futures_intrusive/sync/semaphore.rs.html#791-803\">source</a><h4 class=\"code-header\">pub fn <a href=\"futures_intrusive/sync/struct.GenericSharedSemaphore.html#tymethod.try_acquire\" class=\"fn\">try_acquire</a>(\n    &amp;self,\n    nr_permits: <a class=\"primitive\" href=\"https://doc.rust-lang.org/1.76.0/std/primitive.usize.html\">usize</a>\n) -&gt; <a class=\"enum\" href=\"https://doc.rust-lang.org/1.76.0/core/option/enum.Option.html\" title=\"enum core::option::Option\">Option</a>&lt;<a class=\"struct\" href=\"futures_intrusive/sync/struct.GenericSharedSemaphoreReleaser.html\" title=\"struct futures_intrusive::sync::GenericSharedSemaphoreReleaser\">GenericSharedSemaphoreReleaser</a>&lt;MutexType&gt;&gt;</h4></section></summary><div class=\"docblock\"><p>Tries to acquire a certain amount of permits on a semaphore.</p>\n<p>If acquiring the permits is successful, a <a href=\"futures_intrusive/sync/struct.GenericSharedSemaphoreReleaser.html\" title=\"struct futures_intrusive::sync::GenericSharedSemaphoreReleaser\"><code>GenericSharedSemaphoreReleaser</code></a>\nwill be returned, which will release all acquired permits automatically\nwhen dropped.</p>\n<p>Otherwise <code>None</code> will be returned.</p>\n</div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.release\" class=\"method\"><a class=\"src rightside\" href=\"src/futures_intrusive/sync/semaphore.rs.html#815-817\">source</a><h4 class=\"code-header\">pub fn <a href=\"futures_intrusive/sync/struct.GenericSharedSemaphore.html#tymethod.release\" class=\"fn\">release</a>(&amp;self, nr_permits: <a class=\"primitive\" href=\"https://doc.rust-lang.org/1.76.0/std/primitive.usize.html\">usize</a>)</h4></section></summary><div class=\"docblock\"><p>Releases the given amount of permits back to the semaphore.</p>\n<p>This method should in most cases not be used, since the\n<a href=\"futures_intrusive/sync/struct.GenericSharedSemaphoreReleaser.html\" title=\"struct futures_intrusive::sync::GenericSharedSemaphoreReleaser\"><code>GenericSharedSemaphoreReleaser</code></a> which is obtained when acquiring a Semaphore\nwill automatically release the obtained permits again.</p>\n<p>Therefore this method should only be used if the automatic release was\ndisabled by calling <a href=\"futures_intrusive/sync/struct.GenericSharedSemaphoreReleaser.html#method.disarm\" title=\"method futures_intrusive::sync::GenericSharedSemaphoreReleaser::disarm\"><code>GenericSharedSemaphoreReleaser::disarm</code></a>,\nor when the amount of permits in the Semaphore\nshould increase from the initial amount.</p>\n</div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.permits\" class=\"method\"><a class=\"src rightside\" href=\"src/futures_intrusive/sync/semaphore.rs.html#820-822\">source</a><h4 class=\"code-header\">pub fn <a href=\"futures_intrusive/sync/struct.GenericSharedSemaphore.html#tymethod.permits\" class=\"fn\">permits</a>(&amp;self) -&gt; <a class=\"primitive\" href=\"https://doc.rust-lang.org/1.76.0/std/primitive.usize.html\">usize</a></h4></section></summary><div class=\"docblock\"><p>Returns the amount of permits that are available on the semaphore</p>\n</div></details></div></details>",0,"futures_intrusive::sync::semaphore::if_alloc::if_std::SharedSemaphore"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-Debug-for-GenericSharedSemaphore%3CMutexType%3E\" class=\"impl\"><a class=\"src rightside\" href=\"src/futures_intrusive/sync/semaphore.rs.html#742-750\">source</a><a href=\"#impl-Debug-for-GenericSharedSemaphore%3CMutexType%3E\" class=\"anchor\">§</a><h3 class=\"code-header\">impl&lt;MutexType: <a class=\"trait\" href=\"lock_api/mutex/trait.RawMutex.html\" title=\"trait lock_api::mutex::RawMutex\">RawMutex</a>&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.76.0/core/fmt/trait.Debug.html\" title=\"trait core::fmt::Debug\">Debug</a> for <a class=\"struct\" href=\"futures_intrusive/sync/struct.GenericSharedSemaphore.html\" title=\"struct futures_intrusive::sync::GenericSharedSemaphore\">GenericSharedSemaphore</a>&lt;MutexType&gt;</h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.fmt\" class=\"method trait-impl\"><a class=\"src rightside\" href=\"src/futures_intrusive/sync/semaphore.rs.html#745-749\">source</a><a href=\"#method.fmt\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"https://doc.rust-lang.org/1.76.0/core/fmt/trait.Debug.html#tymethod.fmt\" class=\"fn\">fmt</a>(&amp;self, f: &amp;mut <a class=\"struct\" href=\"https://doc.rust-lang.org/1.76.0/core/fmt/struct.Formatter.html\" title=\"struct core::fmt::Formatter\">Formatter</a>&lt;'_&gt;) -&gt; <a class=\"type\" href=\"https://doc.rust-lang.org/1.76.0/core/fmt/type.Result.html\" title=\"type core::fmt::Result\">Result</a></h4></section></summary><div class='docblock'>Formats the value using the given formatter. <a href=\"https://doc.rust-lang.org/1.76.0/core/fmt/trait.Debug.html#tymethod.fmt\">Read more</a></div></details></div></details>","Debug","futures_intrusive::sync::semaphore::if_alloc::if_std::SharedSemaphore"],["<section id=\"impl-Send-for-GenericSharedSemaphore%3CMutexType%3E\" class=\"impl\"><a class=\"src rightside\" href=\"src/futures_intrusive/sync/semaphore.rs.html#732-735\">source</a><a href=\"#impl-Send-for-GenericSharedSemaphore%3CMutexType%3E\" class=\"anchor\">§</a><h3 class=\"code-header\">impl&lt;MutexType: <a class=\"trait\" href=\"lock_api/mutex/trait.RawMutex.html\" title=\"trait lock_api::mutex::RawMutex\">RawMutex</a> + <a class=\"trait\" href=\"https://doc.rust-lang.org/1.76.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> + <a class=\"trait\" href=\"https://doc.rust-lang.org/1.76.0/core/marker/trait.Sync.html\" title=\"trait core::marker::Sync\">Sync</a>&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.76.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"struct\" href=\"futures_intrusive/sync/struct.GenericSharedSemaphore.html\" title=\"struct futures_intrusive::sync::GenericSharedSemaphore\">GenericSharedSemaphore</a>&lt;MutexType&gt;</h3></section>","Send","futures_intrusive::sync::semaphore::if_alloc::if_std::SharedSemaphore"],["<section id=\"impl-Sync-for-GenericSharedSemaphore%3CMutexType%3E\" class=\"impl\"><a class=\"src rightside\" href=\"src/futures_intrusive/sync/semaphore.rs.html#737-740\">source</a><a href=\"#impl-Sync-for-GenericSharedSemaphore%3CMutexType%3E\" class=\"anchor\">§</a><h3 class=\"code-header\">impl&lt;MutexType: <a class=\"trait\" href=\"lock_api/mutex/trait.RawMutex.html\" title=\"trait lock_api::mutex::RawMutex\">RawMutex</a> + <a class=\"trait\" href=\"https://doc.rust-lang.org/1.76.0/core/marker/trait.Sync.html\" title=\"trait core::marker::Sync\">Sync</a>&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.76.0/core/marker/trait.Sync.html\" title=\"trait core::marker::Sync\">Sync</a> for <a class=\"struct\" href=\"futures_intrusive/sync/struct.GenericSharedSemaphore.html\" title=\"struct futures_intrusive::sync::GenericSharedSemaphore\">GenericSharedSemaphore</a>&lt;MutexType&gt;</h3></section>","Sync","futures_intrusive::sync::semaphore::if_alloc::if_std::SharedSemaphore"],["<details class=\"toggle implementors-toggle\" open><summary><section id=\"impl-Clone-for-GenericSharedSemaphore%3CMutexType%3E\" class=\"impl\"><a class=\"src rightside\" href=\"src/futures_intrusive/sync/semaphore.rs.html#722-728\">source</a><a href=\"#impl-Clone-for-GenericSharedSemaphore%3CMutexType%3E\" class=\"anchor\">§</a><h3 class=\"code-header\">impl&lt;MutexType: <a class=\"trait\" href=\"lock_api/mutex/trait.RawMutex.html\" title=\"trait lock_api::mutex::RawMutex\">RawMutex</a>&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.76.0/core/clone/trait.Clone.html\" title=\"trait core::clone::Clone\">Clone</a> for <a class=\"struct\" href=\"futures_intrusive/sync/struct.GenericSharedSemaphore.html\" title=\"struct futures_intrusive::sync::GenericSharedSemaphore\">GenericSharedSemaphore</a>&lt;MutexType&gt;</h3></section></summary><div class=\"impl-items\"><details class=\"toggle method-toggle\" open><summary><section id=\"method.clone\" class=\"method trait-impl\"><a class=\"src rightside\" href=\"src/futures_intrusive/sync/semaphore.rs.html#723-727\">source</a><a href=\"#method.clone\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"https://doc.rust-lang.org/1.76.0/core/clone/trait.Clone.html#tymethod.clone\" class=\"fn\">clone</a>(&amp;self) -&gt; Self</h4></section></summary><div class='docblock'>Returns a copy of the value. <a href=\"https://doc.rust-lang.org/1.76.0/core/clone/trait.Clone.html#tymethod.clone\">Read more</a></div></details><details class=\"toggle method-toggle\" open><summary><section id=\"method.clone_from\" class=\"method trait-impl\"><span class=\"rightside\"><span class=\"since\" title=\"Stable since Rust version 1.0.0\">1.0.0</span> · <a class=\"src\" href=\"https://doc.rust-lang.org/1.76.0/src/core/clone.rs.html#169\">source</a></span><a href=\"#method.clone_from\" class=\"anchor\">§</a><h4 class=\"code-header\">fn <a href=\"https://doc.rust-lang.org/1.76.0/core/clone/trait.Clone.html#method.clone_from\" class=\"fn\">clone_from</a>(&amp;mut self, source: <a class=\"primitive\" href=\"https://doc.rust-lang.org/1.76.0/std/primitive.reference.html\">&amp;Self</a>)</h4></section></summary><div class='docblock'>Performs copy-assignment from <code>source</code>. <a href=\"https://doc.rust-lang.org/1.76.0/core/clone/trait.Clone.html#method.clone_from\">Read more</a></div></details></div></details>","Clone","futures_intrusive::sync::semaphore::if_alloc::if_std::SharedSemaphore"]]
};if (window.register_type_impls) {window.register_type_impls(type_impls);} else {window.pending_type_impls = type_impls;}})()